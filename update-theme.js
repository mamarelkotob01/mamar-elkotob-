const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
    }
  });
  return results;
}
const files = walk('./artifacts/clickers/src');
let modifiedCount = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  // Make main wrappers transparent
  content = content.replace(/bg-\[#FDFBF7\]/g, 'bg-transparent');
  content = content.replace(/bg-\[#F5F3EF\]/g, 'bg-transparent');
  content = content.replace(/bg-gray-50/g, 'bg-transparent');
  
  // Find min-h-screen and if it has bg-background, make it transparent
  content = content.replace(/className="(.*?min-h-screen.*?)bg-background(.*?)"/g, 'className="$1bg-transparent$2"');
  content = content.replace(/className="(.*?bg-background.*?)min-h-screen(.*?)"/g, 'className="$1bg-transparent$2"');

  // Replace blinding white cards with frosted glass dark cards
  content = content.replace(/bg-white/g, 'bg-card/70 backdrop-blur-xl border-card-border/50 shadow-2xl');
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    modifiedCount++;
  }
});
console.log(`Updated ${modifiedCount} files!`);
