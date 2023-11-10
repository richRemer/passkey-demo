const {PublicKeyCredential} = window;

export async function detect() {
  try {
    const detected = await Promise.all([
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable(),
      PublicKeyCredential.isConditionalMediationAvailable()
    ]);

    return detected.every(v => v);
  } catch (err) {
    console.error(err);
    return false;
  }
}
