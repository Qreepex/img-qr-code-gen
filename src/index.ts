import Base from "./Base";
import Web from "./web/Web";
import Watcher from "./files/Watcher";

const base = new Base();
const watcher = new Watcher(base);
const web = new Web(base);

base;
watcher;
web;
