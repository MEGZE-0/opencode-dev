const fs = require('fs');
const { execSync } = require('child_process');

const files = execSync('git ls-files', { encoding: 'utf-8' }).split('\n').filter(Boolean);
let count = 0;
for (const file of files) {
  if (!file.endsWith('package.json')) continue;
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf-8');
  if (content.includes('"opencode":')) {
    content = content.replace(/"opencode":/g, '"nexusflow":');
    fs.writeFileSync(file, content, 'utf-8');
    count++;
  }
}
console.log('Fixed ' + count + ' package.json files for opencode dependency.');
