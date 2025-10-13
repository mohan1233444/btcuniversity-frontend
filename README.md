# BTC University Frontend

A decentralized learning platform built on Stacks (Bitcoin L2) using Turnkey for wallet management and transaction signing.

## Features

- **Embedded Wallet**: Turnkey-powered wallet creation and management
- **Stacks Contract Integration**: Interact with BTC University smart contracts
  - Whitelist enrollment (requires 10 USD in sBTC)
  - Course enrollment with sBTC payment
  - NFT certificate minting
- **On-Chain Verification**: All credentials stored as NFTs on Stacks blockchain
- **Beautiful UI**: Modern, responsive design with Framer Motion animations

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Wallet**: Turnkey React Wallet Kit
- **Blockchain**: Stacks.js, Stacks Testnet
- **Animation**: Framer Motion

## Smart Contracts

### Main Contract

**Address**: `ST39YX57WQXM1CCHA2RD177N4RA5FEQJKM3F22317.btcuni`

Functions:

- `enroll-whitelist`: Self-enroll if you hold 10+ USD in sBTC
- `enroll-course (uint)`: Enroll in a course by ID
- `complete-course (uint, principal)`: Mark course complete (instructor/owner only)

### NFT Contract

**Address**: `ST39YX57WQXM1CCHA2RD177N4RA5FEQJKM3F22317.btcuniNft`

Functions:

- `mint (principal)`: Mint certificate NFT (owner only)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file based on `.env.local.example`:

```env
TURNKEY_BASE_URL=https://api.turnkey.com
TURNKEY_API_PRIVATE_KEY=your_api_private_key
TURNKEY_API_PUBLIC_KEY=your_api_public_key
TURNKEY_ORGANIZATION_ID=your_organization_id
```

Get your Turnkey credentials from [Turnkey Dashboard](https://app.turnkey.com).

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How It Works

### Transaction Signing Flow

The app uses Turnkey's "Sign Raw Payloads" API to sign Stacks transactions:

1. **Build Unsigned Transaction**: Use `@stacks/transactions` to construct a contract call
2. **Extract Signing Hash**: Get the `sigHash` from `TransactionSigner`
3. **Sign with Turnkey**: Call Turnkey API with `HASH_FUNCTION_NO_OP`
4. **Inject Signature**: Convert Turnkey's ECDSA signature to RSV format
5. **Broadcast**: Send signed transaction to Stacks testnet

See `app/lib/stacks-utils.ts` for implementation details.

### API Routes

- `/api/contract/enroll-whitelist` - Join whitelist
- `/api/contract/enroll-course` - Enroll in course
- `/api/contract/complete-course` - Mark course complete
- `/api/contract/mint-nft` - Mint certificate NFT
- `/api/contract/check-whitelist` - Check whitelist status
- `/api/withdraw` - Transfer STX tokens

## Architecture

```
app/
├── api/
│   ├── contract/           # Contract interaction endpoints
│   └── withdraw/           # STX transfer endpoint
├── components/
│   ├── course-enrollment.tsx   # Course UI
│   ├── nft-certificate.tsx     # Certificate minting
│   └── ...
├── lib/
│   └── stacks-utils.ts    # Stacks/Turnkey integration
├── dashboard/
│   └── page.tsx           # Main dashboard
└── page.tsx               # Landing page
```

## Courses

1. **Start with Bitcoin** - Learn Bitcoin basics
2. **Easy Bitcoin & Stacks** - Understanding Stacks L2
3. **Bitcoin Made Simple** - Buy, store, use Bitcoin
4. **Intro to Stacks** - Building apps on Bitcoin
5. **From Zero to Bitcoin Hero** - Complete beginner guide

## Development Notes

### Network Configuration

- **Testnet**: All contracts deployed on Stacks Testnet
- **API**: Using Hiro's public testnet API (`https://api.testnet.hiro.so`)

### Wallet Address Derivation

Stacks addresses are derived from secp256k1 public keys using compressed format:

```typescript
import { publicKeyToAddress } from "@stacks/transactions";
const address = publicKeyToAddress(pubKey, "testnet");
```

### Testing Contracts

Use the [Stacks Explorer](https://explorer.hiro.so/?chain=testnet) to view transactions and contract state.

Get testnet STX and sBTC from:

- STX Faucet: https://explorer.hiro.so/sandbox/faucet?chain=testnet
- sBTC: Contact the team for testnet sBTC

## Troubleshooting

### "Not enough sBTC" error

- Ensure you have at least 10 USD worth of sBTC
- Check balance on Stacks Explorer

### Transaction fails

- Check nonce (auto-fetched from Hiro API)
- Verify contract addresses
- Check Turnkey API credentials

### Signature errors

- Ensure using `HASH_FUNCTION_NO_OP` with Turnkey
- Verify public key format (compressed)

## References

- [Turnkey Stacks Docs](https://docs.turnkey.com/solutions/stacks)
- [Stacks.js Documentation](https://stacks.js.org)
- [Hiro Platform Docs](https://docs.hiro.so)
- [Turnkey Example Repo](https://github.com/tkhq/sdk/tree/main/examples/with-stacks)

## License

MIT
