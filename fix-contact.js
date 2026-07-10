const fs = require('fs');

const file = 'client/src/pages/Contact.tsx';
let content = fs.readFileSync(file, 'utf8');

// Container Backgrounds
content = content.replace(/bg-\[\#050505\]/g, 'bg-[#FAF9F6]');

// Text colors
content = content.replace(/text-white\/([0-9]+)/g, 'text-black/$1');
content = content.replace(/text-white/g, 'text-[#111111]');

// Borders
content = content.replace(/border-white\/([0-9]+)/g, 'border-black/$1');

// Backgrounds with opacity (often used for panels in dark mode)
content = content.replace(/glass-panel/g, 'bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#E5E7EB]');
content = content.replace(/bg-\[\#0a0a0a\]/g, 'bg-white');
content = content.replace(/bg-white\/5/g, 'bg-black/5');
content = content.replace(/bg-black\/40/g, 'bg-black/5');

// Accents
content = content.replace(/text-neon-cyan/g, 'text-[#0057FF]');
content = content.replace(/text-neon-yellow/g, 'text-[#FFC857]');
content = content.replace(/bg-neon-cyan/g, 'bg-[#0057FF]');
content = content.replace(/bg-neon-yellow/g, 'bg-[#FFC857]');
content = content.replace(/border-neon-cyan/g, 'border-[#0057FF]');
content = content.replace(/border-neon-yellow/g, 'border-[#FFC857]');
content = content.replace(/from-neon-cyan/g, 'from-[#0057FF]');
content = content.replace(/via-neon-yellow/g, 'via-[#FFC857]');
content = content.replace(/to-neon-cyan/g, 'to-[#0057FF]');
content = content.replace(/fill-neon-yellow/g, 'fill-[#FFC857]');
content = content.replace(/text-neon-rose/g, 'text-red-500');
content = content.replace(/bg-neon-rose/g, 'bg-red-500');
content = content.replace(/border-neon-rose/g, 'border-red-500');
content = content.replace(/fill-neon-rose/g, 'fill-red-500');

// Fix button text contrast if needed
content = content.replace(/liquid-glass-cyan/g, 'bg-[#111111] text-white hover:bg-[#333333]');

// Fix text-[#111111]/[opacity] issue
content = content.replace(/text-\[\#111111\]\/([0-9]+)/g, 'text-black/$1');

fs.writeFileSync(file, content);
console.log('Fixed Contact.tsx');
