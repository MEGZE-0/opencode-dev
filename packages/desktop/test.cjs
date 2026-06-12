const fs = require('fs');
const path = require('path');
const { app } = require('electron');

app.whenReady().then(() => {
  const outPath = path.join(app.getPath('userData'), 'sqlite_test.txt');
  let result = `Node version: ${process.versions.node}\n`;
  try {
    const sqlite = require('node:sqlite');
    result += `node:sqlite is supported. Keys: ${Object.keys(sqlite).join(',')}\n`;
  } catch(e) {
    result += `node:sqlite NOT supported: ${e.message}\n`;
  }
  fs.writeFileSync(outPath, result);
  app.quit();
});
