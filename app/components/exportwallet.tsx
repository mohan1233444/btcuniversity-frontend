"use client";

import React, { MouseEvent } from "react";
import { useTurnkey, type Wallet } from "@turnkey/react-wallet-kit";

interface ExportWalletProps {
  wallets: Wallet[];
}

export default function ExportWallet({ wallets }: ExportWalletProps) {
  const { handleExportWallet } = useTurnkey();

  const handleExport = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (wallets.length > 0) handleExportWallet(wallets[0]);
  };

  return (
    <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Export Wallet</h2>
      <button
        onClick={handleExport}
        className="w-full sm:w-auto px-6 py-3 rounded-xl text-white font-semibold bg-indigo-600 hover:bg-indigo-700 shadow-md transition-colors duration-200"
      >
        Export
      </button>
    </section>
  );
}
