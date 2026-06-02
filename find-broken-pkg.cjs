const fs = require('fs');
const { execSync } = require('child_process');

const files = execSync('git ls-files', { encoding: 'utf-8' }).split('\n').filter(Boolean);

for (const file of files) {
  if (!file.endsWith('package.json')) continue;
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf-8');
  if (content.includes('nexusflow-gitlab-auth') || content.includes('nexusflow-poe-auth') || content.includes('gitlab/nexusflow-')) {
    console.log(file);
  }
}
