# Environment Setup for Turnkey + Stacks

## Required Environment Variables

Create a `.env.local` file in the project root with these variables:

```bash
# Turnkey API Credentials (from your Turnkey dashboard)
TURNKEY_BASE_URL=https://api.turnkey.com
TURNKEY_API_PRIVATE_KEY=your_api_private_key_here
TURNKEY_API_PUBLIC_KEY=your_api_public_key_here
TURNKEY_ORGANIZATION_ID=your_organization_id_here

# Server Stacks Wallet (create in Turnkey dashboard)
# This wallet will sign ALL transactions on behalf of users
TURNKEY_SIGNER_PUBLIC_KEY=your_stacks_public_key_here
TURNKEY_SIGNER_ADDRESS=your_stacks_address_here

# Next.js Public Variables
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_TURNKEY_ORGANIZATION_ID=your_organization_id_here
NEXT_PUBLIC_TURNKEY_PUBLISHABLE_KEY=your_publishable_key_here
```

## How to Get These Values

### 1. Turnkey API Credentials

1. Go to your Turnkey dashboard
2. Navigate to **API Keys** section
3. Create a new API key pair
4. Copy the `TURNKEY_API_PRIVATE_KEY`, `TURNKEY_API_PUBLIC_KEY`, and `TURNKEY_ORGANIZATION_ID`

### 2. Server Stacks Wallet

1. In Turnkey dashboard, go to **Wallets**
2. Click **Create Wallet**
3. Choose **Stacks** as the blockchain
4. Select **Testnet** network
5. After creation, copy:
   - The wallet's **public key** → `TURNKEY_SIGNER_PUBLIC_KEY`
   - The wallet's **Stacks address** → `TURNKEY_SIGNER_ADDRESS`

### 3. Publishable Key

1. In Turnkey dashboard, go to **Settings** → **API Keys**
2. Find your **Publishable Key** (safe for client-side use)
3. Copy to `NEXT_PUBLIC_TURNKEY_PUBLISHABLE_KEY`

## Important Notes

⚠️ **Server Wallet Signs Everything**: This setup uses a single server-controlled wallet to sign all transactions. This is a **hackathon workaround** because:

- Turnkey React Wallet Kit doesn't support custom blockchain signing (like Stacks)
- User wallets created in the browser cannot sign transactions server-side

✅ **What This Means**:

- All whitelist enrollments come from the same address (server wallet)
- All course enrollments come from the same address (server wallet)
- NFTs can still be minted to individual user addresses

📝 **For Production**: Switch to `@stacks/connect` with Leather/Xverse wallets for true non-custodial signing.

## Testing

Once configured, restart your dev server:

```bash
npm run dev
```

Then test:

1. Join Whitelist - should work (server signs)
2. Enroll in Course - should work (server signs)
3. Mint NFT - should work (server signs, mints to user address)
