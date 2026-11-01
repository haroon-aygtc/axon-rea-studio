import type { PipelineAgentId } from './types';
export const PIPELINE_AGENTS: {id: PipelineAgentId; name: string; room: string}[] = [
  {id:'intake',name:'Intake',room:'Receiving dock'},
  {id:'analyst',name:'Analyst',room:'Intelligence lab'},
  {id:'spec',name:'Spec Writer',room:'Specification office'},
  {id:'docs',name:'Doc Agents',room:'Documentation studio'},
  {id:'rebuilder',name:'Rebuilder',room:'Clean room'},
  {id:'verifier',name:'Verifier',room:'Testing ground'},
];
