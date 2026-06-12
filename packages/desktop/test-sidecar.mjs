import { utilityProcess } from "electron";
import { app } from "electron";
import { join } from "path";

app.whenReady().then(() => {
  const sidecar = join(__dirname, "out", "main", "sidecar.js");
  console.log("Spawning", sidecar);
  const child = utilityProcess.fork(sidecar, [], {
    stdio: "pipe"
  });

  child.stdout?.on("data", (d) => console.log("STDOUT:", d.toString()));
  child.stderr?.on("data", (d) => console.log("STDERR:", d.toString()));
  
  child.on("message", (msg) => {
    console.log("MESSAGE:", msg);
    if (msg.type === "ready" || msg.type === "error") {
      app.quit();
    }
  });

  child.on("exit", (code) => {
    console.log("EXIT:", code);
    app.quit();
  });

  child.postMessage({
    type: "start",
    hostname: "127.0.0.1",
    port: 54321,
    password: "test",
    userDataPath: __dirname,
    needsMigration: false
  });
});
