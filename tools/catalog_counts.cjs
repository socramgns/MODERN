'use strict';
// Acorn tokenization changes numeric catalogue-size pins, never string/regex
// contents, identifiers, passcodes inside strings, or unrelated numbers.
const fs=require('fs'),acorn=require('./vendor/acorn/acorn.js');
const input=JSON.parse(fs.readFileSync(0,'utf8')),out={sources:{},replacements:{}};
if(!Number.isSafeInteger(input.count)||input.count<1)throw Error('Invalid catalogue count');
for(const [name,code] of Object.entries(input.sources)){
 const changes=[];
 for(const token of acorn.tokenizer(code,{ecmaVersion:'latest',allowHashBang:true})){
  if(token.type.label==='num'&&token.value===19617)changes.push([token.start,token.end]);
 }
 let transformed=code;
 for(const [start,end] of changes.reverse())transformed=transformed.slice(0,start)+String(input.count)+transformed.slice(end);
 out.sources[name]=transformed;if(changes.length)out.replacements[name]=changes.length;
}
process.stdout.write(JSON.stringify(out));
