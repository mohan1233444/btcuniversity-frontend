# BTC University - Stacks Contract Integration Implementation

## Overview

Complete implementation of Stacks smart contract calling with Turnkey wallet signing for the BTC University hackathon project.

## Architecture

### Client-Side Signing

- All transactions are signed on the **frontend** using Turnkey's embedded wallet SDK
- Backend API routes are **optional** (kept for reference but not required)
- User maintains full custody of their keys through Turnkey

### Key Components

#### 1. `app/lib/stacks-client-utils.ts`

Client-side utilities for Stacks contract interactions:

- `signAndBroadcastContractCall()` - Main function to sign and broadcast contract calls
- `fetchAccountNonce()` - Fetches current nonce from Hiro API
- Uses `@turnkey/sdk-browser` for signing in the browser

#### 2. Course Enrollment Component

`app/components/course-enrollment.tsx`

- Join whitelist (requires 10+ USD in sBTC)
- Enroll in courses (5 available courses)
- Check whitelist status
- All transactions signed client-side

#### 3. NFT Certificate Component

`app/components/nft-certificate.tsx`

- Mint NFT certificates for course completion
- On-chain proof of achievement
- Signed client-side with user's wallet

## Contract Functions Implemented

### Main Contract: `ST39YX57WQXM1CCHA2RD177N4RA5FEQJKM3F22317.btcuni`

1. **enroll-whitelist**

   - Args: none
   - Checks if user has 10+ USD in sBTC
   - Adds user to whitelist

2. **enroll-course**

   - Args: `(uint course-id)`
   - Requires whitelist
   - Transfers sBTC payment to contract
   - Enrolls user in course

3. **complete-course**
   - Args: `(uint course-id) (principal student)`
   - Instructor/owner only
   - Marks course as complete

### NFT Contract: `ST39YX57WQXM1CCHA2RD177N4RA5FEQJKM3F22317.btcuniNft`

1. **mint**
   - Args: `(principal recipient)`
   - Owner only
   - Mints certificate NFT to recipient

## Transaction Signing Flow

```
1. User Action (e.g., "Join Whitelist")
   ↓
2. Build Unsigned Transaction
   - makeUnsignedContractCall() from @stacks/transactions
   - Set contract address, function name, args
   - Fetch nonce from Hiro API
   ↓
3. Generate Signing Hash
   - TransactionSigner extracts sigHash
   - Generate preSignSigHash with sigHashPreSign()
   ↓
4. Sign with Turnkey (Browser)
   - Call turnkey.signRawPayload()
   - Use HASH_FUNCTION_NO_OP (hash already computed)
   - signWith: user's public key
   ↓
5. Attach Signature
   - Convert to RSV format: v + r + s
   - Set on transaction.auth.spendingCondition.signature
   ↓
6. Broadcast Transaction
   - broadcastTransaction() to Stacks testnet
   - Hiro API: https://api.testnet.hiro.so
   ↓
7. Return Transaction ID
   - Display success message with txId
   - User can view on Stacks Explorer
```

## Environment Variables

Required in `.env.local`:

```env
# Optional: Only needed if you want server-side signing (not recommended for dApp)
TURNKEY_BASE_URL=https://api.turnkey.com
TURNKEY_API_PRIVATE_KEY=your_private_key
TURNKEY_API_PUBLIC_KEY=your_public_key
TURNKEY_ORGANIZATION_ID=your_org_id

# Frontend (optional, defaults to https://api.turnkey.com)
NEXT_PUBLIC_TURNKEY_BASE_URL=https://api.turnkey.com
```

## Network Configuration

- **Network**: Stacks Testnet
- **Hiro API**: https://api.testnet.hiro.so
- **Block Explorer**: https://explorer.hiro.so/?chain=testnet

## Testing

### Get Testnet Tokens

1. **STX Faucet**: https://explorer.hiro.so/sandbox/faucet?chain=testnet
2. **sBTC**: Contact BTC University team for testnet sBTC

### Test Flow

1. Create Turnkey wallet (click "Start Learning")
2. Get testnet sBTC
3. Join whitelist (dashboard → "Join Whitelist")
4. Enroll in a course (select course → "Enroll Now")
5. Mint certificate (bottom of dashboard)

## Key Differences from Original Instructions

### What Changed

1. **Client-Side Signing**: Moved from server-side to browser-side signing

   - More secure for users (non-custodial)
   - Follows dApp best practices
   - Users maintain full control of keys

2. **Simplified API**: Removed server-side contract call endpoints

   - Still have read-only endpoints (check-whitelist)
   - STX transfer endpoint remains for reference

3. **Direct Turnkey Integration**: Using `@turnkey/sdk-browser`
   - No need for API key management in frontend
   - Leverages Turnkey's embedded wallet session

## Common Issues & Solutions

### Issue: "PUBLIC_KEY_NOT_FOUND"

**Cause**: Trying to sign with server API keys instead of user's embedded wallet
**Solution**: Use client-side signing (implemented in this version)

### Issue: Transaction fails with nonce error

**Cause**: Nonce mismatch or transaction pending
**Solution**: Auto-fetched from Hiro API; wait for pending tx to complete

### Issue: "Insufficient balance"

**Cause**: Not enough sBTC for course payment or gas
**Solution**: Get more testnet sBTC from team

## Files Created/Modified

### New Files

- `app/lib/stacks-client-utils.ts` - Client signing utilities
- `app/components/course-enrollment.tsx` - Course enrollment UI
- `app/components/nft-certificate.tsx` - NFT minting UI
- `app/components/courses-overview.tsx` - Courses showcase
- `.env.local.example` - Environment template
- `IMPLEMENTATION.md` - This file
- `README.md` - Updated documentation

### Modified Files

- `app/dashboard/page.tsx` - Added course & NFT sections
- `app/page.tsx` - Added courses overview
- `app/components/learningpath.tsx` - Interactive steps with actions
- `package.json` - Added @turnkey/sdk-browser, @stacks/network

### Kept for Reference (Server-side)

- `app/api/contract/` - Server-side endpoints (optional)
- `app/lib/stacks-utils.ts` - Server signing (not used)

## Production Checklist

Before deploying to mainnet:

- [ ] Update contract addresses to mainnet
- [ ] Change network from "testnet" to "mainnet" in stacks-client-utils.ts
- [ ] Update Hiro API URL to mainnet
- [ ] Test all flows thoroughly on testnet
- [ ] Audit smart contracts
- [ ] Set up proper error handling and logging
- [ ] Configure rate limiting
- [ ] Add analytics tracking

## Resources

- [Turnkey Stacks Documentation](https://docs.turnkey.com/solutions/stacks)
- [Stacks.js Transactions](https://stacks.js.org/modules/_stacks_transactions.html)
- [Hiro Platform Documentation](https://docs.hiro.so)
- [Stacks Testnet Explorer](https://explorer.hiro.so/?chain=testnet)

## Support

For issues or questions:

1. Check Turnkey docs for wallet/signing issues
2. Check Stacks.js docs for transaction building
3. Check Hiro docs for API/network issues
4. Review implementation in this codebase
