"use client";

import React, { useEffect, useState } from "react";
import { useTurnkey } from "@turnkey/react-wallet-kit";
import { useRouter } from "next/navigation";
import { publicKeyToAddress } from "@stacks/transactions";

// Import components
import Header from "../components/header";
import CreateWallet from "../components/createWallet";
import WalletDisplay from "../components/displayWallet";
import Balance from "../components/balance";
import ExportWallet from "../components/exportwallet";
import WithdrawSTX from "../components/withdrawwallet";

export default function DashboardPage() {
  const router = useRouter();
  const { authState, wallets } = useTurnkey();
  const [stxAddress, setStxAddress] = useState(""); // STX address
  const [stxPubKey, setStxPubKey] = useState("");   // STX public key
  const [balance, setBalance] = useState<bigint>(0n); // balance in micro-STX
  const [loadingBalance, setLoadingBalance] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (authState !== "authenticated") router.push("/");
  }, [authState, router]);

  // Get STX wallet address and public key
  useEffect(() => {
    const account = wallets?.[0]?.accounts?.[0];
    const pubKey = account?.publicKey;
   
    console.log(pubKey)
   

    if (pubKey ) {
      setStxPubKey(pubKey); 
      try {
        const address = publicKeyToAddress(pubKey, "mainnet"); // convert pubKey → STX address
         console.log(address)
        setStxAddress(address);
      } catch (err) {
        console.error(err);
      }
    }
  }, [wallets]);

  // Fetch balance from Hiro API
  useEffect(() => {
    if (!stxAddress) return;

    const fetchBalance = async () => {
      setLoadingBalance(true);
      try {
        const res = await fetch(
          `https://api.hiro.so/extended/v1/address/${stxAddress}/balances?unanchored=true`
        );
        if (!res.ok) throw new Error("Failed to fetch balance");
        const data = await res.json();
        setBalance(BigInt(data.stx?.balance || "0")); // store as micro-STX
      } catch (err) {
        console.error("Error fetching balance:", err);
        setBalance(0n);
      } finally {
        setLoadingBalance(false);
      }
    };

    fetchBalance();
  }, [stxAddress]);

  if (authState !== "authenticated") return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <Header />
      <main className="max-w-3xl mx-auto space-y-8">
        {wallets.length === 0 && <CreateWallet />}
        <WalletDisplay stxwallet={stxAddress} />
        <Balance stxwallet={stxAddress} balance={balance} loading={loadingBalance} />
        <ExportWallet wallets={wallets} />
        {/* Pass both STX address and public key */}
        <WithdrawSTX stxPubKey={stxPubKey} balance={balance} />
      </main>
    </div>
  );
}
