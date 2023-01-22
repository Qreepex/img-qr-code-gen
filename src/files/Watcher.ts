import Base from "../Base";
import chokidar from "chokidar";
import { readFileSync } from "fs";
import { Client, Server } from "nextcloud-node-client";

class Watcher {
  base: Base;
  client: Client;
  _watcher: chokidar.FSWatcher;
  server: Server;
  constructor(base: Base) {
    this.base = base;

    this.server = new Server({
      basicAuth: {
        password: base.config.nextcloud.password,
        username: base.config.nextcloud.username,
      },
      url: "https://cloud.bens.live",
    });
    this.client = new Client(this.server);

    this._watcher = chokidar.watch("images/", {
      ignored: /(^|[\/\\])\../,
      persistent: true,
    });

    let ready = false;
    this._watcher.on("ready", () => {
      ready = true;
      console.info("👀 Watcher Ready!");
    });

    this._watcher.on("add", async _path => {
      if (!ready) return;

      try {
        const filename = _path.split("\\")[1];

        console.info("🖼 New Image created: " + filename);
        const file = await this.client.createFile("/images/" + filename, readFileSync("./images/" + filename));
        console.info("☁ Uploaded Image: " + filename);

        const share = await this.client.createShare({ fileSystemElement: file });

        this.base.emit("newurl", share.url);

        console.info("🔗 Share for Image " + filename + ": " + share.url);
        console.info(" ");
      } catch (error) {
        console.log(error);
      }
    });
  }
}

export default Watcher;
