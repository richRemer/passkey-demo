import http from "http";
import express from "express";
import bodyParser from "body-parser";
import {configure, User, UserRepository} from "passkey-demo";

const config = configure(process.env);
const app = express();
const server = http.createServer(app);
const users = new UserRepository(User);

app.use(express.static(`${config.root}/srv`));
app.use(bodyParser.json());

app.post("/register", async (req, res) => {
  const registration = await users.register(req.body.name);
  res.json(registration);
});

server.listen(config.port, function() {
  const {address, port} = this.address();
  const host = address.includes(":") ? `[${address}]` : address;
  console.info(`listening on ${host}:${port}`);
});
