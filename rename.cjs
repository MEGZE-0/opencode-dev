const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const files = execSync('git ls-files', { encoding: 'utf-8' }).split('\n').filter(Boolean);

let changed = 0;
for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf-8');
  let newContent = content
    .replace(/@opencode-ai\//g, '@nexusflow/')
    .replace(/OPENCODE_/g, 'NEXUSFLOW_')
    .replace(/OpenCode/g, 'NexusFlow')
    .replace(/\.opencode/g, '.nexusflow')
    .replace(/opencode\.json/g, 'nexusflow.json');

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf-8');
    changed++;
  }
}
console.log('Modified ' + changed + ' files.');
