const fs = require('fs');
const { execSync } = require('child_process');

const files = execSync('git ls-files', { encoding: 'utf-8' }).split('\n').filter(Boolean);

let changed = 0;
for (const file of files) {
  if (!fs.existsSync(file)) continue;
  if (file.endsWith('.png') || file.endsWith('.ico') || file.endsWith('.woff2') || file.endsWith('.ttf') || file.endsWith('.pdf')) continue;
  let content = fs.readFileSync(file, 'utf-8');
  let newContent = content.replace(/opencode/g, 'nexusflow');

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf-8');
    changed++;
  }
}
console.log('Modified ' + changed + ' files for lowercase opencode -> nexusflow.');
