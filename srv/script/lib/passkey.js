const {location, PublicKeyCredential} = window;
const ecdsa = Object.freeze({alg: -7, type: "public-key"});
const pkcs1 = Object.freeze({alg: -257, type: "public-key"});
const algo = {ecdsa, pkcs1};

export async function detect() {
  try {
    const detected = await Promise.all([
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable(),
      //PublicKeyCredential.isConditionalMediationAvailable()
    ]);

    return detected.every(v => v);
  } catch (err) {
    console.error(err);
    return false;
  }
}

export function createOptions(registration, name=location.hostname) {
  const {hostname: id} = location;
  const publicKey = {...registration};

  publicKey.user = {...publicKey.user};
  publicKey.user.id = base64decode(publicKey.user.id);
  publicKey.challenge = base64decode(publicKey.challenge);
  publicKey.rp = {name, id};
  publicKey.pubKeyCredParams = [algo.ecdsa, algo.pkcs1];
  publicKey.authenticatorSelection = {requireResidentKey: true};

  return {publicKey};
}

function base64decode(base64) {
  const ascii = atob(base64);
  const bytes = new Uint8Array([...ascii].map(ch => ch.charCodeAt(0)));
  return bytes.buffer;
}

function base64encode(buffer) {
  const bytes = new Uint8Array(buffer);
  const string = String.fromCharCode(...bytes);
  return btoa(string);
}
