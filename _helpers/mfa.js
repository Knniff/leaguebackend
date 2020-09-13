const crypto = require("crypto");
const base32 = require("hi-base32");
const ErrorHelper = require("./error-helper");

function generateSecret(length) {
  const randomBuffer = crypto.randomBytes(Number(length));
  return base32.encode(randomBuffer).replace(/=/g, "");
}

function dynamicTruncationFn(hmacValue) {
  const offset = hmacValue[hmacValue.length - 1] & 0xf;

  return (
    ((hmacValue[offset] & 0x7f) << 24) |
    ((hmacValue[offset + 1] & 0xff) << 16) |
    ((hmacValue[offset + 2] & 0xff) << 8) |
    (hmacValue[offset + 3] & 0xff)
  );
}

function generateHOTP(secret, counter) {
  const decodedSecret = base32.decode.asBytes(secret);
  const buffer = Buffer.alloc(8);
  for (let i = 0; i < 8; i++) {
    buffer[7 - i] = counter & 0xff;
    counter = counter >> 8;
  }

  // Step 1: Generate an HMAC-SHA-1 value
  const hmac = crypto.createHmac("sha1", Buffer.from(decodedSecret));
  hmac.update(buffer);
  const hmacResult = hmac.digest();

  // Step 2: Generate a 4-byte string (Dynamic Truncation)
  const code = dynamicTruncationFn(hmacResult);

  // Step 3: Compute an HOTP value
  return code % 10 ** 6;
}

function generateTOTP(secret, window = 0) {
  const counter = Math.floor(Date.now() / 30000);
  return generateHOTP(secret, counter + window)
    .toString()
    .padStart(6, "0");
}

function verifyTOTP(token, secret, window) {
  if (Math.abs(+window) > 5) {
    throw new ErrorHelper(
      "Internal Server Error",
      500,
      "MFA Window is too large.",
    );
  }
  const buffer = Buffer.from(token);
  for (
    let errorWindow = -window;
    errorWindow <= +window;
    errorWindow += 1
  ) {
    const totp = generateTOTP(secret, errorWindow);
    const isValid = crypto.timingSafeEqual(
      buffer,
      Buffer.from(Buffer.from(totp)),
    );
    if (isValid) {
      return true;
    }
  }
  return false;
}

module.exports = {
  generateSecret,
  verifyTOTP,
  generateTOTP,
};

// copied from:
// https://hackernoon.com/how-to-implement-google-authenticator-two-factor-auth-in-javascript-091wy3vh3
