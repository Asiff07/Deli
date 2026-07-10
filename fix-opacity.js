const fs = require('fs');

const files = [
  'client/src/pages/Shop.tsx',
  'client/src/pages/About.tsx',
  'client/src/pages/Support.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/text-\[\#111111\]\/([0-9]+)/g, 'text-black/$1');
  fs.writeFileSync(file, content);
  console.log('Fixed ' + file);
});
