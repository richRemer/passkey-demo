export class User {
  id;
  name;
  displayName;
  authentication;

  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.displayName = "";
    this.authentication = null;
  }

  getChallenge() {
    return this.authentication?.challenge;
  }

  isRegistered() {
    return Boolean(this.authentication);
  }

  register(attestationResult) {
    if (this.isRegistered()) {
      throw new Error("cannot change user authentication");
    }

    const {authnrData} = attestationResult;
    const publicKey = authnrData.get("credentialPublicKeyPem");
    const counter = authnrData.get("counter");

    return this.authentication = {publicKey, counter};
  }

  toJSON() {
    const {id, name, displayName} = this;
    return {id, name, displayName};
  }
}
