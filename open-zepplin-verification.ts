import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

const addresses = ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045','0xeee718c1e522ecb4b609265db7a83ab48ea0b06f','0x14536667cd30e52c0b458baaccb9fada7046e056', '0x14536667cd30e52c0b458baaccb9fada7046e045', '0x14536667cd30e52c0b458baaccb9fada7046e046', '0x14536667cd30e51c0b458baaccb9fada7046e046']

// OZ expects array of values, each value is also an array
const tree = StandardMerkleTree.of(
  addresses.map(addr => [addr]),
  ["address"]
);

console.log("OZ Root:", tree.root);