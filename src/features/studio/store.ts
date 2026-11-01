import { create } from 'zustand';
import { inspectWebsite } from '../../lib/rea-website';
import { PIPELINE_AGENTS } from './engine/agents';
import { ingest, makeFile } from './engine/ingest';
import { runPipeline } from './engine/pipeline';
import type { AgentProgress, PipelineAgentId, StudioEvent, StudioFile, Target } from './engine/types';
export interface StudioState {
 status:'idle'|'loading'|'running'|'done'|'error';error:string|null;
 authorized:boolean;setAuthorized(v:boolean):void;target:Target|null;
 agents:Record<PipelineAgentId,AgentProgress>;events:StudioEvent[];eventCount:number;
 startedAt:number|null;finishedAt:number|null;
 loadFiles(files:File[]|FileList):Promise<void>;loadSample():Promise<void>;loadWebsite(url:string):Promise<void>;reset():void;
}
function initialAgents():Record<PipelineAgentId,AgentProgress>{
 const progress=():AgentProgress=>({count:0,status:'waiting',items:[],active:false});
 return {intake:progress(),analyst:progress(),spec:progress(),docs:progress(),rebuilder:progress(),verifier:progress()};
}
export const useStudio=create<StudioState>()((set,get)=>{
 let controller:AbortController|undefined;
 let flushTimer:ReturnType<typeof setTimeout>|undefined;
 const stop=()=>{controller?.abort();if(flushTimer)clearTimeout(flushTimer);flushTimer=undefined;};
 const load=async(source:()=>Promise<{files:StudioFile[];name:string}>)=>{
  stop();const current=new AbortController();controller=current;
  const start=Date.now();const allowed=get().authorized;
  let events:StudioEvent[]=[];let count=0;let agents=initialAgents();
  const flush=()=>{flushTimer=undefined;if(controller!==current)return;set({events:[...events],eventCount:count,agents:{...agents}});};
  const queue=()=>{if(!flushTimer)flushTimer=setTimeout(flush,60);};
  const emit=(type:string,payload:Record<string,unknown>)=>{if(controller!==current)return;events=[...events,{seq:++count,t:Date.now()-start,type,payload}].slice(-500);queue();};
  set({status:allowed?'loading':'error',error:allowed?null:'Authorization is required before scanning.',target:null,agents,events:[],eventCount:0,startedAt:start,finishedAt:null});
  emit('authorization',{authorized:allowed,...(allowed?{authorizedAt:start}:{})});
  if(!allowed){set({finishedAt:Date.now()});flush();return;}
  try{
   const input=await source();current.signal.throwIfAborted();set({status:'running'});
   const target=await runPipeline(input.files,input.name,{emit,onAgent:(id,items,status)=>{
    if(controller!==current)return;
    const prev=agents[id];agents={...agents,[id]:{count:prev.count+items.length,status,items:[...prev.items,...items].slice(-70),active:status!=='done'}};queue();
   }},current.signal);
   if(controller!==current)return;
   target.authorizedAt=start;flush();set({target,status:'done',finishedAt:Date.now()});
  }catch(error){if(controller!==current || current.signal.aborted)return;
   const message=error instanceof Error?error.message:String(error);emit('run.error',{message});
   agents=Object.fromEntries(Object.entries(agents).map(([id,p])=>[id,{...p,active:false}])) as typeof agents;
   flush();set({status:'error',error:message,finishedAt:Date.now()});
  }
 };
 return {
 status:'idle',error:null,authorized:false,target:null,agents:initialAgents(),events:[],eventCount:0,startedAt:null,finishedAt:null,
 setAuthorized:authorized=>set({authorized}),
 loadFiles:files=>load(async()=>({files:await ingest(files),name:files.length===1?files[0]!.name:files.length+' files'})),
 loadSample:()=>load(async()=>{const files=await Promise.all(['/studio.html','/studio-suite.js'].map(async path=>{const r=await fetch(path);if(!r.ok)throw new Error('Sample fetch failed: '+r.status);return makeFile(path.slice(1),await r.text());}));return {files,name:'REA Studio (sample)'};}),
 loadWebsite:url=>load(async()=>{const result=await inspectWebsite(url);return {name:result.url,files:result.files.map(f=>makeFile(f.path,f.content,f.size))};}),
 reset:()=>{stop();controller=undefined;set({status:'idle',error:null,authorized:false,target:null,agents:initialAgents(),events:[],eventCount:0,startedAt:null,finishedAt:null});},
 };
});
