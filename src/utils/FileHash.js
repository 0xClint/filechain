import { Buffer } from "buffer";

function arrayBufferToBuffer(ab) {
  var buffer = new Buffer(ab.byteLength);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buffer.length; ++i) {
    buffer[i] = view[i];
  }
  return buffer;
}

function hexString(buffer) {
  const byteArray = new Uint8Array(buffer);
  const hexCodes = [...byteArray].map((value) => {
    return value.toString(16).padStart(2, "0");
  });

  return hexCodes.join("");
}

async function fileToArrayBuffer(file) {
  return new Promise(function (resolve, reject) {
    const reader = new FileReader();
    const readFile = function (event) {
      const buffer = reader.result;
      resolve(buffer);
    };

    reader.addEventListener("load", readFile);
    reader.readAsArrayBuffer(file);
  });
}

async function bufferToSha256(buffer) {
  return window.crypto.subtle.digest("SHA-256", buffer);
}

async function fileToSha256Hex(file) {
  const buffer = await fileToArrayBuffer(file);
  const hash = await bufferToSha256(arrayBufferToBuffer(buffer));
  return hexString(hash);
}

export default async function fileHash(e) {
  const hash = await fileToSha256Hex(e);
  return hash;
}
