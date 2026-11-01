import { afterEach, describe, expect, it } from 'vitest';
import { extract } from '../features/studio/engine/extract';
import { SKIP, toText } from '../features/studio/engine/ingest';
import { useStudio } from '../features/studio/store';
afterEach(()=>useStudio.getState().reset());
describe('studio engine',()=>{
 it('extracts URLs, method endpoints, storage and routes at concrete lines',()=>{
 const f=extract('const origin="https://example.com/a";\naxios.post("/api/save");\nlocalStorage.setItem("token", "x");\nconst route = "/home";', 'app.ts');
 expect(f.find(x=>x.kind==='url')).toMatchObject({value:'https://example.com/a',file:'app.ts',line:1});
 expect(f.find(x=>x.kind==='endpoint')).toMatchObject({value:'/api/save',method:'POST',line:2});
 expect(f.find(x=>x.kind==='storage')).toMatchObject({value:'token',line:3});
 expect(f.find(x=>x.kind==='route')).toMatchObject({value:'/home',line:4});
 });
 it('skips dependencies and images but not sources',()=>{
 expect(SKIP.test('node_modules/pkg/index.js')).toBe(true);expect(SKIP.test('assets/logo.PNG')).toBe(true);expect(SKIP.test('src/app.ts')).toBe(false);
 });
 it('extracts terminated printable strings from binary bytes',()=>{
 expect(toText(new Uint8Array([0,0,65,66,67,68,69,70,0,120,121,0]))).toBe('ABCDEF');
 expect(toText(new TextEncoder().encode('hello\nworld'))).toBe('hello\nworld');
 });
 it('refuses file loading without authorization and records refusal',async()=>{
 await useStudio.getState().loadFiles([]);const s=useStudio.getState();
 expect(s.status).toBe('error');expect(s.error).toBe('Authorization is required before scanning.');expect(s.target).toBeNull();
 expect(s.events[0]).toMatchObject({seq:1,type:'authorization',payload:{authorized:false}});
 });
});
