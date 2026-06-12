const fs = require('fs');
const { app } = require('electron');
app.whenReady().then(() => {
  fs.writeFileSync('node_version.txt', process.versions.node);
  try {
    require('node:sqlite');
    fs.writeFileSync('sqlite_support.txt', 'yes');
  } catch(e) {
    fs.writeFileSync('sqlite_support.txt', e.message);
  }
  app.quit();
});
