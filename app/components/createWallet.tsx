"use client";

import React, { useState, MouseEvent } from "react";
import { useTurnkey } from "@turnkey/react-wallet-kit";

export default function CreateWallet() {
  const { createWallet, refreshWallets } = useTurnkey();
  const [creating, setCreating] = useState(false);

  const handleCreateWallet = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setCreating(true);
    try {
      await createWallet({
        walletName: "stx wallet",
        accounts: [
          {
            curve: "CURVE_SECP256K1",
            pathFormat: "PATH_FORMAT_BIP32",
            path: `m/44'/5757'/0'/0/0`,
            addressFormat: "ADDRESS_FORMAT_COMPRESSED",
          },
        ],
      });
      await refreshWallets();
    } catch (error) {
      console.error(error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Create STX Wallet</h2>
      <button
        onClick={handleCreateWallet}
        disabled={creating}
        className="w-full sm:w-auto px-6 py-3 rounded-xl text-white font-semibold shadow-md transition-colors duration-200 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
      >
        {creating ? "Creating..." : "Create STX Wallet"}
      </button>
    </section>
  );
}
