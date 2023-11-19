const {PublicKeyCredential} = window;

export async function detect() {
  try {
    const detected = await Promise.all([
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
    ]);

    return detected.every(v => v);
  } catch (err) {
    console.error(err);
    return false;
  }
}

export function decodeCreationOptions(creationOptions) {
  return {
    publicKey: {
      ...creationOptions,
      user: {
        ...creationOptions.user,
        id: base64Decode(creationOptions.user.id)
      },
      challenge: base64Decode(creationOptions.challenge)
    }
  };
}

export function decodeRequestOptions(requestOptions) {
  return {
    publicKey: {
      ...requestOptions,
      challenge: base64Decode(requestOptions.challenge)
    }
  };
}

export function encodeCredential(credential) {
  return {
    authenticatorAttachment: credential.authenticatorAttachment,
    id: credential.id,
    response: encodeResponse(credential.response),
    type: credential.type
  };
}

function base64Decode(string) {
  const base64 = string.replace(/_/g, "/").replace(/-/g, "+")
  const ascii = atob(base64);
  const bytes = new Uint8Array([...ascii].map(ch => ch.charCodeAt(0)));
  return bytes.buffer;
}

function base64Encode(buffer) {
  const bytes = new Uint8Array(buffer);
  const ascii = String.fromCharCode(...bytes);
  const base64 = btoa(ascii);
  return base64.replace(/\//g, "_").replace(/\+/g, "-").replace(/=+$/, "");
}

function encodeResponse(response) {
  return {
    attestationObject: encode(response.attestationObject),
    authenticatorData: encode(response.authenticatorData),
    clientDataJSON: base64Encode(response.clientDataJSON),
    signature: encode(response.signature),
    userHandle: encode(response.userHandle)
  };

  function encode(buffer) {
    return buffer ? base64Encode(buffer) : undefined;
  }
}
