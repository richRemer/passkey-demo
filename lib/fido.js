import {randomBytes} from "crypto";
import cbor from "cbor";
import {Fido2Lib} from "fido2-lib";

export const ECDSA = -7;
export const PKCS1 = -257;

export class FIDO {
  constructor(options) {
    this.id = options.rpId;
    this.fido = new Fido2Lib(options);
  }

  static ECDSA = ECDSA;
  static PKCS1 = PKCS1;

  get origin() {
    return `https://${this.id}`;
  }

  async challenge() {
    const options = await this.fido.assertionOptions();
    options.challenge = base64Encode(options.challenge);
    return options;
  }

  async login(credential, challenge, user) {
    const {origin} = this;
    const {authentication, id: userHandle} = user;
    const expectation = {challenge, origin, factor, userHandle};

    credential.id = base64Decode(credential.id);
    expectation.publicKey = authentication.publicKey;
    expectation.prevCounter = authentication.counter;

    return this.fido.assertionResult(credential, expectation);
  }

  async register(credential, challenge) {
    const {origin} = this;
    const expectation = {challenge, origin, factor};
    const {response} = credential;

    credential.id = base64Decode(credential.id);

    return this.fido.attestationResult(credential, expectation);
  }

  async registration() {
    const options = await this.fido.attestationOptions();
    options.challenge = base64Encode(options.challenge);
    return options;
  }
}

function base64Encode(buffer) {
  return Buffer.from(buffer).toString("base64url");
}

function base64Decode(string) {
  return new Uint8Array(Buffer.from(string, "base64url")).buffer;
}

const factor = "either";
