# Contract Configuration Guide

## Environment Variables Setup

All contract addresses are now centralized in `.env.local` for easy configuration.

### Required Environment Variables

Create a `.env.local` file with these variables:

```bash
# Stacks Network
NEXT_PUBLIC_STACKS_NETWORK=testnet

# BTC University Main Contract
NEXT_PUBLIC_BTCUNI_CONTRACT_ADDRESS=ST39YX57WQXM1CCHA2RD177N4RA5FEQJKM3F22317
NEXT_PUBLIC_BTCUNI_CONTRACT_NAME=btcuni

# BTC University NFT Contract
NEXT_PUBLIC_BTCUNI_NFT_CONTRACT_ADDRESS=ST39YX57WQXM1CCHA2RD177N4RA5FEQJKM3F22317
NEXT_PUBLIC_BTCUNI_NFT_CONTRACT_NAME=btcuniNft

# sBTC Token Contract (Official Testnet)
NEXT_PUBLIC_SBTC_CONTRACT_ADDRESS=ST1F7QA2MDF17S807EPA36TSS8AMEFY4KA9TVGWXT
NEXT_PUBLIC_SBTC_CONTRACT_NAME=sbtc-token

# DIA Oracle Contract (for price feeds)
NEXT_PUBLIC_DIA_ORACLE_CONTRACT_ADDRESS=ST39YX57WQXM1CCHA2RD177N4RA5FEQJKM3F22317
NEXT_PUBLIC_DIA_ORACLE_CONTRACT_NAME=dia-oracle
```

## Contract Addresses Explained

### 1. BTC University Contracts

- **Main Contract**: Handles whitelist, course enrollment, and payments
- **NFT Contract**: Mints completion certificates

**Current Testnet Address**: `ST39YX57WQXM1CCHA2RD177N4RA5FEQJKM3F22317`

### 2. sBTC Token Contract

**Official Testnet**: `ST1F7QA2MDF17S807EPA36TSS8AMEFY4KA9TVGWXT.sbtc-token`

⚠️ **Important**: Your BTC University contract must use this EXACT address when checking sBTC balances!

### 3. DIA Oracle

For price feeds (sBTC/USD). Required for whitelist enrollment validation.

## Updating Your Smart Contract

Your `btcuni.clar` contract has a hardcoded sBTC address that needs updating:

```clarity
;; ❌ WRONG - This won't match user balances
(contract-call?
  'ST39YX57WQXM1CCHA2RD177N4RA5FEQJKM3F22317.sbtc-token
  get-balance-available
  tx-sender
)

;; ✅ CORRECT - Official testnet sBTC token
(contract-call?
  'ST1F7QA2MDF17S807EPA36TSS8AMEFY4KA9TVGWXT.sbtc-token
  get-balance-available
  tx-sender
)
```

## Switching Networks

To switch from testnet to mainnet:

1. Update `.env.local`:

```bash
NEXT_PUBLIC_STACKS_NETWORK=mainnet
```

2. Update all contract addresses to their mainnet equivalents

3. Restart your dev server:

```bash
npm run dev
```

## Verifying Configuration

After updating `.env.local`, check the console logs when loading the dashboard:

```
Fetching sBTC balance for: STFWX0GCAVN8WDTV9ZHGB8MKYT1RN0A2JDWM19MR
sBTC contract: ST1F7QA2MDF17S807EPA36TSS8AMEFY4KA9TVGWXT.sbtc-token
```

The contract addresses should match your configuration!
