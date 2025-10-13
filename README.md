# BTCUni Frontend

# Turnkey + Stacks Transactions Guide

This guide explains how to **build, sign, and broadcast Stacks blockchain transactions** using the **Turnkey SDK** for secure signing.  
It covers **STX token transfers**, **smart contract calls**, and **public key handling** for Stacks.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Requirements](#requirements)
3. [Setup](#setup)
4. [How Turnkey Transactions Work](#how-turnkey-transactions-work)
5. [Constructing a Stacks Transaction](#constructing-a-stacks-transaction)
6. [Signing with Turnkey](#signing-with-turnkey)
7. [Broadcasting the Transaction](#broadcasting-the-transaction)
8. [Converting Turnkey Public Keys to Stacks Addresses](#converting-turnkey-public-keys-to-stacks-addresses)
9. [Example: Contract Call Transaction](#example-contract-call-transaction)
10. [Tips and Troubleshooting](#tips-and-troubleshooting)
11. [References](#references)

---

## Introduction

This project demonstrates:

- Secure transaction signing with **Turnkey SDK**
- Constructing **STX token transfer** transactions
- Constructing **contract call** transactions
- Handling **public key conversion** for Stacks compatibility

---

## Requirements

- Node.js v18+
- npm or yarn
- A funded **Stacks testnet account**
- Turnkey account with an active API key

---

## Setup

1. **Install dependencies**

```bash
npm install @turnkey/sdk-server @stacks/transactions dotenv @noble/secp256k1

## Create .env.local

TURNKEY_BASE_URL=https://api.turnkey.com
TURNKEY_API_PRIVATE_KEY=your_turnkey_private_key
TURNKEY_API_PUBLIC_KEY=your_turnkey_public_key
TURNKEY_ORGANIZATION_ID=your_turnkey_org_id
TURNKEY_SIGNER_PUBLIC_KEY=your_stacks_signer_public_key
STACKS_RECIPIENT_ADDRESS=ST3J2GVMMM2R07ZFBJDWTYEYAR8FZH5WKDTFJ9AHA
STACKS_NETWORK=testnet

## Load environment variables in code
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

## How Turnkey Transactions Work

- Turnkey manages signing securely:

- Construct unsigned Stacks transaction

- Generate a pre-signature hash of the transaction

- Send the hash to Turnkey for signing

- Turnkey returns the signature

- Inject the signature into the transaction

- Broadcast to the Stacks network

- Turnkey keeps your private key secure; you never handle it directly.

## Constructing a Stacks Transaction

- Example: STX token transfer

import {
  makeUnsignedSTXTokenTransfer,
  TransactionSigner,
} from "@stacks/transactions";

const constructStacksTx = async (pubKey: string) => {
  const recipient = process.env.STACKS_RECIPIENT_ADDRESS!;
  const nonce = 0n;
  const fee = 180n;

  const transaction = await makeUnsignedSTXTokenTransfer({
    recipient,
    amount: 1_000_000n, // 0.01 STX
    publicKey: pubKey,
    nonce,
    fee,
    network: process.env.STACKS_NETWORK!,
  });

  const signer = new TransactionSigner(transaction);
  return { stacksTransaction: transaction, stacksTxSigner: signer };
};

## Signing with Turnkey

- Generate the pre-sign hash and sign via Turnkey:
import { sigHashPreSign, createMessageSignature } from "@stacks/transactions";
import { Turnkey as TurnkeyServerSDK } from "@turnkey/sdk-server";

const client = new TurnkeyServerSDK({
  apiBaseUrl: process.env.TURNKEY_BASE_URL!,
  apiPrivateKey: process.env.TURNKEY_API_PRIVATE_KEY!,
  apiPublicKey: process.env.TURNKEY_API_PUBLIC_KEY!,
  defaultOrganizationId: process.env.TURNKEY_ORGANIZATION_ID!,
});

const generatePreSignSigHash = (tx, signer) =>
  sigHashPreSign(
    signer.sigHash,
    tx.auth.authType,
    tx.auth.spendingCondition.fee,
    tx.auth.spendingCondition.nonce
  );

const signStacksTx = async () => {
  const stacksPublicKey = process.env.TURNKEY_SIGNER_PUBLIC_KEY!;
  const { stacksTransaction, stacksTxSigner } = await constructStacksTx(stacksPublicKey);
  const preSignSigHash = generatePreSignSigHash(stacksTransaction, stacksTxSigner);

  const payload = `0x${preSignSigHash}`;
  const signature = await client.apiClient().signRawPayload({
    payload,
    signWith: stacksPublicKey,
    encoding: "PAYLOAD_ENCODING_HEXADECIMAL",
    hashFunction: "HASH_FUNCTION_NO_OP",
  });

  const nextSig = `${signature!.v}${signature!.r.padStart(64, "0")}${signature!.s.padStart(64, "0")}`;
  stacksTransaction.auth.spendingCondition.signature = createMessageSignature(nextSig);

  return stacksTransaction;
};

## Broadcasting the Transaction
import { broadcastTransaction } from "@stacks/transactions";

const handleBroadcastTx = async () => {
  const tx = await signStacksTx();
  const result = await broadcastTransaction({ transaction: tx!, network: process.env.STACKS_NETWORK! });
  console.log("Broadcast Result:", result);
};

(async () => { await handleBroadcastTx(); })();

## Converting Turnkey Public Keys to Stacks Addresses

- Turnkey may return uncompressed secp256k1 keys. Convert them to compressed format to derive a Stacks address:
import * as secp from "@noble/secp256k1";
import { publicKeyToAddress } from "@stacks/transactions";

const turnkeyResponse = { publicKey: "04a1b2c3d4e5f6a7..." };

// Convert uncompressed → compressed
const compressed = secp.Point.fromHex(turnkeyResponse.publicKey).toRawBytes(true);
const compressedHex = Buffer.from(compressed).toString("hex");

// Derive Stacks addresses
const mainnetAddress = publicKeyToAddress(compressedHex, "mainnet");
const testnetAddress = publicKeyToAddress(compressedHex, "testnet");

console.log("Compressed Public Key:", compressedHex);
console.log("Stacks Mainnet Address:", mainnetAddress);
console.log("Stacks Testnet Address:", testnetAddress);

## Workflow:

- Create wallet in Turnkey → receive uncompressed key

- Convert to compressed using the snippet above

- Derive Stacks address for funding/verification

 - Use compressed key for building/signing transactions

## Example: Contract Call Transaction
import { makeUnsignedContractCall, uintCV } from "@stacks/transactions";

const tx = await makeUnsignedContractCall({
  contractAddress: "ST3J2GVMMM2R07ZFBJDWTYEYAR8FZH5WKDTFJ9AHA",
  contractName: "counter",
  functionName: "increment_with_value",
  functionArgs: [uintCV(42)],
  publicKey: compressedHex,
  nonce: 1n,
  fee: 300n,
  network: "testnet",
});

- Signing and broadcasting flow is identical to STX transfers.











## Overview
BTCUni is a smart contract for an on-chain course platform.  
- **Students** can enroll in courses.  
- **Instructors** can mark course completions.  
- **Admin** controls course creation and manages who is allowed to join.  

---

## Key Terms
- **Owner/Admin**: The person who controls the platform.  
- **Course Price**: Default is `10 Usd` in sBTC per course.  

---

## Errors You Might See
| Code  | Meaning |
|-------|---------|
| `100` | Only the owner can do this |
| `101` | Course not found |
| `102` | You are not allowed to join |
| `103` | You are not enrolled in this course |
| `104` | Already enrolled or already allowed |
| `107` | Not enough STX to pay |
| `108` | Unauthorized action |

---

## How Data is Stored
- **course-id** → keeps track of the latest course number  
- **whitelisted-beta** → tracks which students are allowed to join  
- **courses** → stores info about each course (name, details, price, instructor, max students)  
- **student-courses** → tracks which courses a student is enrolled in and their progress  

---

## Functions You Can Use

### Whitelist Management
- **enroll-whitelist()** → Student requests to join the whitelist  
- **add-whitelist(student)** → Admin adds a student  
- **remove-whitelist(student)** → Admin removes a student  
- **is-whitelisted-beta(student)** → Check if a student is allowed  

### Course Management
- **add-course(name, details, price, max-students)** → Admin adds a new course  
- **get-course-details(id)** → See info about a course  
- **get-course-count()** → See how many courses exist  

### Enrollment
- **enroll-course(course-id)** → Student enrolls and pays for a course  
- **complete-course(course-id, student)** → Instructor or admin marks course as completed  

---

## Notes
- Only students on the whitelist can enroll.  
- Payments are in STX and go to the admin.  
- Only the instructor or admin can mark course completions.  
