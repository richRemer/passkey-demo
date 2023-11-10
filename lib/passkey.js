import {randomBytes} from "crypto";

// https://w3c.github.io/webauthn/#sctn-cryptographic-challenges
// 16 byte recommended minimum
const CHALLENGE_SIZE = 16;

// https://w3c.github.io/webauthn/#sctn-user-handle-privacy
// 64 byte recommended
const ID_SIZE = 64;

export function generateChallenge() {
  return randomBytes(CHALLENGE_SIZE);
}

export function generateId() {
  return randomBytes(ID_SIZE);
}

export function createRegistration(user) {
  const challenge = generateChallenge().toString("base64");
  const id = user.id.toString("base64");
  const {name, displayName} = user;

  return {
    challenge,
    user: {id, name, displayName},
    excludeCredentials: []
  };
}
