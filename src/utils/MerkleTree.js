const { MerkleTree } = require("merkletreejs");
const SHA256 = require("crypto-js/sha256");

export default async function getMerkleRootHash(hashes) {
  if (hashes) {
    const tree = new MerkleTree(hashes, SHA256);
    const root = tree.getRoot().toString("hex");
    console.log(tree.toString());
    return root;
  } else {
    console.log("didn't received hashes to merkle calculation");
  }
}
