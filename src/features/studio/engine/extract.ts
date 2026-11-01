import type { Finding, FindingKind } from './types';
export function extract(txt: string, path: string): Finding[] {
 const findings: Finding[]=[];
 const add=(kind: FindingKind,value: string,index: number,extra: Partial<Pick<Finding,'method'|'el'|'ver'>>={})=>{
 findings.push({id:'F'+(findings.length+1),kind,value,file:path,line:txt.slice(0,index).split('\n').length,tag:'observed',...extra});
 };
 for(const m of txt.matchAll(/https?:\/\/[A-Za-z0-9.-]+\.[a-z]{2,}(?::\d+)?(?:\/[^\s"'`<>)\\]*)?/g))add('url',m[0]!.slice(0,80),m.index);
 for(const m of txt.matchAll(/(fetch|axios\.(?:get|post|put|delete|patch)|\$\.(?:get|post))\(\s*[`'"]([^`'"\s]{2,90})/g))if(/^(\/|https?:)/.test(m[2]!)){const g=m[1]!,me=/post/.test(g)?'POST':/put/.test(g)?'PUT':/delete/.test(g)?'DELETE':/patch/.test(g)?'PATCH':/get/.test(g)?'GET':'';add('endpoint',m[2]!,m.index,{method:me})}
 for(const m of txt.matchAll(/["'`](\/api\/[\w\-\/{}:.]*)["'`]/g))add('endpoint',m[1]!,m.index,{method:''});
 for(const m of txt.matchAll(/(?:from\s+|require\(\s*|import\(\s*)['"]([^'"./][^'"]*)['"]/g))add('import',m[1]!,m.index);
 for(const m of txt.matchAll(/(?:localStorage|sessionStorage)\.(?:get|set|remove)Item\(\s*['"]([^'"]+)['"]/g))add('storage',m[1]!,m.index);
 for(const m of txt.matchAll(/(?:path|route|href)\s*[:=]\s*['"](\/[\w\-\/:]*|#\/?[\w\-\/]*)['"]/g))add('route',m[1]!,m.index);
 for(const m of txt.matchAll(/<(title|button|h1|h2|h3|label)\b[^>]*>\s*([^<>{]{2,60}?)\s*</g))add('ui',m[2]!,m.index,{el:m[1]!});
 if(/package\.json$/.test(path)){try{const j: unknown=JSON.parse(txt); if(!j || typeof j !== 'object') return findings; const obj=j as Record<string, unknown>;for(const k of['dependencies','devDependencies'])for(const [n,v] of Object.entries((obj[k] && typeof obj[k] === 'object' ? obj[k] : {}) as Record<string, unknown>))add('dep',n,0,{ver:String(v)})}catch(e){}}
return findings;
}
