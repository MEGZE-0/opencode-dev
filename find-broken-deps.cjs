const fs = require('fs');
const { execSync } = require('child_process');

const files = execSync('git ls-files', { encoding: 'utf-8' }).split('\n').filter(Boolean);

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  if (file.endsWith('.png') || file.endsWith('.ico') || file.endsWith('.woff2') || file.endsWith('.ttf') || file.endsWith('.pdf')) continue;
  let content = fs.readFileSync(file, 'utf-8');
  if (content.includes('nexusflow-poe-auth') || content.includes('nexusflow-gitlab-auth')) {
    console.log(file);
  }
}
