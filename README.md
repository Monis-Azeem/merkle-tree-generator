# Merkle Tree Generator

A web application for generating, verifying, and managing Merkle trees for Ethereum wallet addresses with cryptographic proof generation and verification capabilities.

## Features

- **Merkle Tree Generation** - Creates complete binary tree from Ethereum addresses
- **Proof Generation** - Generates cryptographic proofs for address inclusion
- **Proof Verification** - Verifies if an address belongs to the tree using its proof
- **Address Validation** - Validates Ethereum wallet address format using ethers.js
- **JSON Export** - Export proofs in JSON format for on-chain verification
- **Dark/Light Theme** - Theme support via next-themes
- **Security** - Implements OpenZeppelin standards (double-hashing of leaves, lexicographic sorting)

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui (Radix UI)
- **Cryptography**: ethers.js (keccak256 hashing)
- **Notifications**: Sonner (toast notifications)

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd merkle-tree-generator

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `npm run dev` | `vite` | Start development server with HMR |
| `npm run build` | `tsc -b && vite build` | TypeScript compilation + production build |
| `npm run lint` | `eslint .` | Run ESLint on all files |
| `npm run preview` | `vite preview` | Preview production build locally |

## Usage

### 1. Generate Merkle Root

Enter Ethereum addresses (one per line) in the textarea and click "Generate Merkle Root". The application will:
- Validate all addresses
- Build the Merkle tree
- Display the root hash
- Pre-compute proofs for all addresses

### 2. Generate Proof

Enter a specific address to generate its Merkle proof. The proof is output as a JSON array of sibling hashes needed for on-chain verification.

### 3. Verify Address

Enter an address to verify its inclusion in the tree. The application will check if the address belongs to the generated Merkle tree.

## Core Functions

### `createTree(addresses: string[])`
Constructs a Merkle tree from an array of Ethereum addresses. Returns a 2D array representing the tree layers.

### `generateProof(tree: string[][], hashIndex: number)`
Generates a Merkle proof for a leaf at the specified index. Returns an array of sibling hashes.

### `verify(leaf: string, proofArray: string[], root: string)`
Verifies if a leaf belongs to the tree by reconstructing the root from the proof.

## Security Considerations

This implementation follows OpenZeppelin's Merkle tree standards:

- **Double Hashing of Leaves**: Leaf nodes are hashed twice to prevent second preimage attacks
- **Lexicographic Sorting**: Sibling hashes are sorted before concatenation to prevent swap attacks
- **32-byte Padding**: Addresses are padded to 32 bytes (Solidity standard)
- **Odd Node Handling**: Unpaired nodes move up without duplication to avoid known vulnerabilities

## Project Structure

```
merkle-tree-generator/
├── merkle-tree/
│   └── merkle-tree.ts      # Core Merkle tree implementation
├── src/
│   ├── App.tsx             # Main React component
│   ├── main.tsx            # React entry point
│   ├── components/ui/      # shadcn/ui components
│   └── lib/utils.ts        # Utility functions
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Use Cases

- Whitelist verification for NFT mints
- Airdrop eligibility verification
- Token distribution validation
- Access control systems

## Author

Monis Azeem

## License

MIT
