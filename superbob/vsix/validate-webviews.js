const fs=require('fs'), path=require('path'), os=require('os'), vm=require('vm');
const src=fs.readFileSync(path.join(__dirname,'extension','extension.js'),'utf8');
// pull out each `function <name>Html(...) { ... }` by brace-matching
function extract(fnName){
  const start=src.indexOf('function '+fnName+'(');
  if(start<0) return null;
  let i=src.indexOf('{',start), depth=0, j=i;
  for(;j<src.length;j++){ const c=src[j]; if(c==='{')depth++; else if(c==='}'){depth--; if(depth===0){j++;break;}} }
  return src.slice(start,j);
}
const stubs={ esc:s=>String(s||''), path, os, JSON, Math, Date:{now:()=>0}, RULESYNC_TARGETS:[], process:{env:{},platform:'darwin'} };
const names=['managerHtml','getWebviewHtml','viewerHtml','howToHtml','builderHtml','guideHtml','diagramHtml'];
let fail=0;
for(const nm of names){
  const code=extract(nm); if(!code){ console.log('  skip '+nm); continue; }
  let html;
  try{
    const ctx=vm.createContext(Object.assign({},stubs));
    // provide args the fn needs
    const call = nm==='guideHtml' ? nm+'({kit:"k",tagline:"t",skills:[],examples:[],tips:[],outline:[]})'
               : nm==='builderHtml' ? nm+'([])'
               : nm==='viewerHtml' ? nm+'("skill","x")'
               : nm==='diagramHtml' ? nm+'({cspSource:"vscode-resource:"},[{title:"P",uri:"u"}])'
               : nm+'()';
    vm.runInContext(code+'\n; globalThis.__out='+call+';', ctx, {timeout:2000});
    html=ctx.__out;
  }catch(e){ console.log('  ⚠️ '+nm+' render error: '+e.message); fail++; continue; }
  // extract each <script> block and syntax-check it
  const scripts=[...String(html).matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
  let ok=true;
  scripts.forEach((s,idx)=>{ try{ new vm.Script(s); }catch(e){ ok=false; fail++; console.log('  ❌ '+nm+' script#'+idx+' SYNTAX ERROR: '+e.message); } });
  if(ok) console.log('  ✅ '+nm+' ('+scripts.length+' script block(s)) parse cleanly');
}
console.log(fail? ('\nFAILED: '+fail) : '\nALL WEBVIEW SCRIPTS PARSE');
process.exit(fail?1:0);
