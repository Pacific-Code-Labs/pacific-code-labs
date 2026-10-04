import { writeFile, readdir } from 'node:fs/promises';
const cdn=process.env.VITE_CDN_URL||'https://cdn.pacific-code-labs.jcampos.dev';
const response=await fetch(`${cdn}/published/landing.json`);
if(!response.ok){if(process.env.REQUIRE_PUBLISHED==='true')throw new Error(`Published content unavailable (${response.status})`);console.warn('Building bundled content: published snapshot unavailable.');process.exit(0);}
const snapshot=await response.json();
const content=new URL('../src/content/',import.meta.url);
for(const file of await readdir(content)){
 if(!file.endsWith('.json'))continue;
 const value=snapshot.content?.[file.slice(0,-5)];
 if(value!==undefined)await writeFile(new URL(file,content),JSON.stringify(value,null,2)+'\n');
}
for(const locale of ['en','es'])if(snapshot.translations?.[locale])await writeFile(new URL(`../src/translations/${locale}.json`,import.meta.url),JSON.stringify(snapshot.translations[locale],null,2)+'\n');
