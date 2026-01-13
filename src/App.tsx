import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import {
  createTree,
  generateProof,
  verify,
  calculateAddressHash,
} from "../merkle-tree/merkle-tree";
import { ethers } from "ethers";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

function App() {
  const [addresses, setAddresses] = useState<string>(
    "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b\n0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c\n0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d"
  );
  const [merkleRoot, setMerkleRoot] = useState<string>("");
  const [ethAddresses, setEthAddresses] = useState<Array<string>>();
  const [tree, setTree] = useState<Array<Array<`0x${string}`>>>();
  const [address, setAddress] = useState<string>();
  const [textProof, setTextProof] = useState<string>();
  const [addressToVerify, setAddressToVerify] = useState<string>();
  const [allProofs, setAllProofs] = useState<Array<Array<`0x${string}`>>>([[]]);

  const arrayOfAddresses = addresses
    .split("\n")
    .map((line) => line.replace(/[\s.]/g, ""))
    .filter((line) => line.length > 0);

  const calculateMerkleRoot = () => {
    for (const address of arrayOfAddresses) {
      try {
        checkValidAddresses(address as `0x${string}`);
      } catch (error) {
        toast.error("Invalid Ethereum Wallet Address");
        // setMerkleRoot("");
        return;
      }
    }
    const tree = createTree(arrayOfAddresses as Array<`0x${string}`>);
    setTree(tree);
    setMerkleRoot(tree[tree.length - 1][0]);
    setEthAddresses(arrayOfAddresses);

    setAllProofs(
      arrayOfAddresses.map((_, index) => generateProof(tree, index))
    );
  };

  const checkValidAddresses = (address: `0x${string}`) => {
    ethers.getAddress(address);
  };

  const calculateProof = () => {
    try {
      checkValidAddresses(address as `0x${string}`);
    } catch (error) {
      toast.error("Invalid Ethereum Wallet Address");
      return;
    }

    const index = ethAddresses?.indexOf(address ?? "");
    if (index !== -1)
      setTextProof(JSON.stringify(generateProof(tree ?? [], index ?? 0)));
    else toast.error("Address does not exist in Merkle Tree");
  };

  const verifyAddress = () => {
    try {
      checkValidAddresses(addressToVerify as `0x${string}`);
    } catch (error) {
      toast.error("Invalid Ethereum Wallet Address");
      return;
    }

    const proof = allProofs[arrayOfAddresses.indexOf(addressToVerify ?? "")];

    console.log("Proof: ", proof);
    if (proof === undefined) {
      toast.error("Address does not exist in merkle tree");
      return;
    }

    verify(
      calculateAddressHash(addressToVerify as `0x${string}`),
      proof,
      merkleRoot as `0x${string}`
    );

    // if(exists)
    toast.success("Address exists in Merkle Tree");
    // else
    // toast.error("Address does not exists")
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="flex justify-center items-center w-full relative p-7">
          <h1 className="font-bold text-4xl">Merkle Tree Generator</h1>
          <p className="absolute right-0 p-5">
            Created by{" "}
            <a
              href="https://github.com/Monis-Azeem"
              target="_blank"
              className="text-blue-700 font-bold underline"
            >
              Monis
            </a>
          </p>
        </div>

        {/* Generate Merkle Root */}
        <div className="grid w-[50%] gap-4 p-5">
          <Label htmlFor="address">Type your ethereum addresses here(One per Line)</Label>
          <Textarea
            placeholder="Address"
            value={addresses}
            onChange={(e) => setAddresses(e.target.value)}
            cols={1}
          />
          <Button onClick={calculateMerkleRoot} disabled={addresses === ""}>
            Generate Merkle Root
          </Button>

          <h2>{merkleRoot.length > 0 ? `Merkle Root: ${merkleRoot}` : ""}</h2>
        </div>

        {/* Generate Merkle Proof */}
        <div className="gap-2 grid w-[50%] p-5">
          <Label htmlFor="address">Generate Merkle Proof</Label>
          <Input
            type="text"
            id="address"
            placeholder="Enter Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <Button onClick={calculateProof}>Generate Proof</Button>
          <Textarea placeholder="Proofs" disabled value={textProof} />
        </div>

        {/* Verification */}
        <div className="gap-2 grid w-[50%] p-5">
          <Label htmlFor="address">
            Verify if an address belongs to Merkle Tree
          </Label>
          <Input
            type="text"
            id="address"
            placeholder="Enter Address"
            value={addressToVerify}
            onChange={(e) => setAddressToVerify(e.target.value)}
          />
          <Button onClick={verifyAddress}>Verify Address</Button>
        </div>
      </div>
    </>
  );
}

export default App;
