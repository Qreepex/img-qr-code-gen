import Base from "../Base";
import express, { Express } from "express";
import http from "http";
import { Server, Socket } from "socket.io";

class Web {
  base: Base;
  app: Express;
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
  io: Server;
  activeSockets: Socket[];
  constructor(base: Base) {
    this.base = base;

    this.app = express();

    this.server = http.createServer(this.app);

    this.io = new Server(this.server);

    this.activeSockets = [];

    this.io.on("connection", socket => {
      socket.on("disconnect", () => {
        this.activeSockets = this.activeSockets.filter(s => s !== socket);
      });

      this.activeSockets.push(socket);
    });

    this.base.on("newurl", url => {
      this.activeSockets.map(socket => socket.emit("newurl", url));
    });

    this.app.use(express.static(__dirname + "/public"));

    this.server.listen(3000, () => {
      console.log("listening on *:3000");
    });

    this.app.get("/", (req, res) => {
      res.sendFile(__dirname + "/index.html");
    });
  }
}

export default Web;
