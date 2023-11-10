import http from "http";
import express from "express";
import {configure} from "passkey-demo";

const config = configure(process.env);
const app = express();
const server = http.createServer(app);

app.use(express.static(`${config.root}/srv`));

server.listen(config.port, function() {
  const {address, port} = this.address();
  const host = address.includes(":") ? `[${address}]` : address;
  console.info(`listening on ${host}:${port}`);
});
