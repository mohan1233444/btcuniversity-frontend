"use client";

import React, { MouseEvent } from "react";
import { useTurnkey } from "@turnkey/react-wallet-kit";

export default function Header() {
  const { refreshWallets, logout } = useTurnkey();



  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
      <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
        Welcome, <span className="text-blue-600">Stx UserDeafult001 </span>!
      </h1>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={(e: MouseEvent<HTMLButtonElement>) => { e.preventDefault(); refreshWallets(); }}
          className="px-5 py-2 bg-green-600 text-white rounded-xl shadow-md hover:bg-green-700 transition-colors duration-200"
        >
          Refresh Wallets
        </button>
        <button
          onClick={(e: MouseEvent<HTMLButtonElement>) => { e.preventDefault(); logout(); }}
          className="px-5 py-2 bg-red-600 text-white rounded-xl shadow-md hover:bg-red-700 transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
