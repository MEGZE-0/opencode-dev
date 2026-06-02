const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const files = execSync('git ls-files', { encoding: 'utf-8' }).split('\n').filter(Boolean);

for (const file of files) {
  const basename = path.basename(file);
  if (basename.includes('opencode')) {
    const newName = basename.replace(/opencode/g, 'nexusflow');
    const newPath = path.join(path.dirname(file), newName);
    if (!fs.existsSync(file)) continue;
    console.log(`Renaming ${file} to ${newPath}`);
    fs.renameSync(file, newPath);
  }
}
