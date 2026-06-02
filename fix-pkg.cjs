const fs = require('fs');
const { execSync } = require('child_process');

const files = execSync('git ls-files', { encoding: 'utf-8' }).split('\n').filter(Boolean);

let changed = 0;
for (const file of files) {
  if (!file.endsWith('package.json')) continue;
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf-8');
  let newContent = content.replace(/@opencode-ai\//g, '@nexusflow/');

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf-8');
    changed++;
  }
}
console.log('Modified ' + changed + ' package.json files.');
