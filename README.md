# Merkle Tree Generator

A web application for generating and verifying Merkle trees for Ethereum wallet addresses.

## Features

- Generate Merkle root from a list of Ethereum addresses
- Generate Merkle proofs for specific addresses
- Verify if an address belongs to the Merkle tree
- Address validation using ethers.js

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- ethers.js (keccak256 hashing)

## Installation

```bash
npm install
npm run dev
```

## Usage

1. **Generate Merkle Root** - Enter Ethereum addresses (one per line) and click "Generate Merkle Root"
2. **Generate Proof** - Enter an address to get its Merkle proof
3. **Verify Address** - Check if an address exists in the tree

## Author

[Monis Azeem](https://github.com/Monis-Azeem)
