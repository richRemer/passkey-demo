import {randomBytes} from "crypto";
import {FIDO} from "passkey-demo";

export default function configure(env) {
  const root = new URL("..", import.meta.url).pathname;
  const port = Number(env.PASSKEY_PORT) || undefined;
  const ip = env.PASSKEY_IP || undefined;
  const secret = env.PASSKEY_SECRET || randomBytes(24).toString("base64");
  const session = configureSession(secret);
  const rpId = env.PASSKEY_HOST || "localhost";
  const rpName = env.PASSKEY_NAME || rpId;
  const fido = configureFido(rpId, rpName);

  return {root, port, ip, session, fido};
}

function configureFido(rpId, rpName) {
  const attestation = "none";
  const cryptoParams = [FIDO.ECDSA, FIDO.PKCS1];
  const authenticatorRequireResidentKey = true;

  return {
    rpId, rpName, attestation, cryptoParams,
    authenticatorRequireResidentKey
  };
}

function configureSession(secret) {
  const resave = false;
  const saveUninitialized = false;
  const cookie = {secure: true};

  return {secret, resave, saveUninitialized, cookie};
}
