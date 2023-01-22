import EventEmitter from "events";
import { readFileSync } from "fs";

class Base extends EventEmitter {
  config: {
    nextcloud: {
      username: string;
      password: string;
      url: string;
    };
  };
  constructor() {
    super();

    this.config = JSON.parse(readFileSync("./config/config.json", { encoding: "utf-8" }));
  }
}

export default Base;
