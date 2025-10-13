"use client";

import React, { useEffect, useState } from "react";
import { useTurnkey } from "@turnkey/react-wallet-kit";
import { useRouter } from "next/navigation";
import {
  publicKeyToAddress,
  fetchCallReadOnlyFunction,
  cvToValue,
  Cl,
} from "@stacks/transactions";
import { STACKS_TESTNET } from "@stacks/network";

// Import components
import Header from "../components/header";
import CreateWallet from "../components/createWallet";
import WalletDisplay from "../components/displayWallet";
import Balance from "../components/balance";
import ExportWallet from "../components/exportwallet";
import WithdrawSTX from "../components/withdrawwallet";
import CourseEnrollment from "../components/course-enrollment";
import NFTCertificate from "../components/nft-certificate";

export default function DashboardPage() {
  const router = useRouter();
  const { authState, wallets } = useTurnkey();
  const [stxAddress, setStxAddress] = useState(""); // STX address
  const [stxPubKey, setStxPubKey] = useState(""); // STX public key
  const [stxBalance, setStxBalance] = useState<bigint>(0n); // STX balance in micro-STX
  const [sbtcBalance, setSbtcBalance] = useState<bigint>(0n); // sBTC balance
  const [loadingBalance, setLoadingBalance] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (authState !== "authenticated") router.push("/");
  }, [authState, router]);

  // Get STX wallet address and public key
  useEffect(() => {
    const account = wallets?.[0]?.accounts?.[0];
    const pubKey = account?.publicKey;

    console.log(pubKey);

    if (pubKey) {
      setStxPubKey(pubKey);
      try {
        const address = publicKeyToAddress(pubKey, "testnet"); // convert pubKey → STX address (TESTNET)
        console.log("Testnet address:", address);
        setStxAddress(address);
      } catch (err) {
        console.error(err);
      }
    }
  }, [wallets]);

  // Fetch STX and sBTC balances
  useEffect(() => {
    if (!stxAddress) return;

    const fetchBalances = async () => {
      setLoadingBalance(true);
      try {
        // Fetch STX balance from Hiro API
        const stxRes = await fetch(
          `https://api.testnet.hiro.so/extended/v1/address/${stxAddress}/balances?unanchored=true`
        );
        if (!stxRes.ok) throw new Error("Failed to fetch STX balance");
        const stxData = await stxRes.json();
        setStxBalance(BigInt(stxData.stx?.balance || "0"));

        // Fetch sBTC balance using proper Stacks.js method
        const sbtcContractAddress =
          process.env.NEXT_PUBLIC_SBTC_CONTRACT_ADDRESS!;
        const sbtcContractName = process.env.NEXT_PUBLIC_SBTC_CONTRACT_NAME!;

        console.log("Fetching sBTC balance for:", stxAddress);
        console.log(
          "sBTC contract:",
          `${sbtcContractAddress}.${sbtcContractName}`
        );

        const sbtcCv = await fetchCallReadOnlyFunction({
          contractAddress: sbtcContractAddress,
          contractName: sbtcContractName,
          functionName: "get-balance-available",
          functionArgs: [Cl.principal(stxAddress)],
          senderAddress: stxAddress,
          network: STACKS_TESTNET,
        });

        const sbtcValue = cvToValue(sbtcCv) as any;
        console.log("sBTC balance response:", sbtcValue);

        // The response is (response uint uint) - extract the inner value
        const balance = sbtcValue?.value || 0;
        console.log("sBTC balance:", balance);
        setSbtcBalance(BigInt(balance));
      } catch (err) {
        console.error("Error fetching balances:", err);
        setStxBalance(0n);
        setSbtcBalance(0n);
      } finally {
        setLoadingBalance(false);
      }
    };

    fetchBalances();
  }, [stxAddress]);

  if (authState !== "authenticated") return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      <main className="space-y-8">
        <div className="max-w-3xl mx-auto px-8 pt-8 space-y-8">
          {wallets.length === 0 && <CreateWallet />}
          <WalletDisplay stxwallet={stxAddress} />
          <Balance
            stxwallet={stxAddress}
            stxBalance={stxBalance}
            sbtcBalance={sbtcBalance}
            loading={loadingBalance}
          />
          <ExportWallet wallets={wallets} />
          <WithdrawSTX stxPubKey={stxPubKey} balance={stxBalance} />
        </div>

        {/* Full-width course enrollment and NFT sections */}
        {wallets.length > 0 && (
          <>
            <CourseEnrollment />
            <NFTCertificate />
          </>
        )}
      </main>
    </div>
  );
}
