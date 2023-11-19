import http from "http";
import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import morgan from "morgan";
import {configure, FIDO, User, UserRepository} from "passkey-demo";

const config = configure(process.env);
const app = express();
const server = http.createServer(app);
const fido = new FIDO(config.fido);
const users = new UserRepository(User);

app.set("trust proxy", 1);
app.use(express.static(`${config.root}/srv`));
app.use(morgan("tiny"));
app.use(session(config.session));
app.use(bodyParser.json());

app.post("/registration", async (req, res) => {
  const {username} = req.body;
  const user = await users.reserve(username);
  const options = await fido.registration();

  options.user = user;
  req.session.user = user.id;
  req.session.challenge = options.challenge;
  res.json(options);
});

app.post("/register", async (req, res) => {
  const credential = req.body;
  const user = await users.load(req.session.user);
  const {challenge} = req.session;
  const result = await fido.register(credential, challenge);

  user.register(result);
  req.session.user = await users.store(user);
  delete req.session.challenge;
  res.json(user);
});

app.get("/challenge", async (req, res) => {
  const options = await fido.challenge();

  req.session.challenge = options.challenge;
  res.json(options);
});

app.post("/login", async (req, res) => {
  const credential = req.body;
  const {challenge} = req.session;
  const {userHandle} = credential.response;
  const user = await users.load(userHandle);

  await fido.login(credential, challenge, user);
  delete req.session.challenge;
  req.session.user = user.id;
  res.json(user);
});

app.post("/logout", async (req, res) => {
  req.session.destroy();
  res.sendStatus(204);
});

server.listen(config.port, config.ip, function() {
  const {address, port} = this.address();
  const host = address.includes(":") ? `[${address}]` : address;

  if (!localhost(host)) {
    console.warn("this better be running behind a proxy");
  }

  console.info(`listening on ${host}:${port}`);

  function localhost(ip) {
    return ip === "[::1]" || ip.startsWith("127.");
  }
});
