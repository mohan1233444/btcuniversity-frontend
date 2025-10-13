# Syndicate Lab Solana Wallet Dashboard

A simple Next.js dashboard integrating **Turnkey Embedded Wallets** for Solana. This project allows users to log in, create Solana wallets, and manage their wallets via the Turnkey React SDK.

---


<img src="screenshots/0.png" alt="login" width="400"/>


<img src="screenshots/1.png" alt="dashboard" width="400"/>
<img src="screenshots/2.png" alt="login" width="400"/>
<img src="screenshots/4.png" alt="login" width="400"/>
<img src="screenshots/5.png" alt="login" width="400"/>



## Features

- Turnkey authentication (email + auth proxy)
- Solana-only wallet creation
- Wallet list and refresh
- Logout functionality
- Fully styled with Tailwind CSS

---

## Setup Instructions

### 1. Fork the repository

1. Click **Fork** in the top-right corner of this repository.
2. Clone your fork locally:

```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
npm install
# or
yarn install
cp .env.example .env


NEXT_PUBLIC_TURNKEY_CLIENT_ID=your_client_id
NEXT_PUBLIC_TURNKEY_AUTH_PROXY_URL=http://localhost:3000

npm run dev
# or
yarn dev

