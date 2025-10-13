"use client";

import React, { useState, MouseEvent, useEffect } from "react";
import { validateStacksAddress } from "@stacks/transactions";

interface WithdrawSTXProps {
  stxPubKey: string; // Public key for signing
  balance: bigint;   // balance in micro-STX
}

export default function WithdrawSTX({ stxPubKey, balance }: WithdrawSTXProps) {
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [withdrawing, setWithdrawing] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleWithdrawStacks = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setToast(null);

    if (!withdrawAddress || amount <= 0) {
      return setToast({ type: "error", message: "Enter a valid recipient and amount" });
    }

    if (!validateStacksAddress(withdrawAddress)) {
      return setToast({ type: "error", message: "Invalid STX address" });
    }

    const amountMicro = BigInt(Math.floor(amount * 1_000_000));
    if (amountMicro > balance) {
      return setToast({ type: "error", message: "Insufficient balance" });
    }

    try {
      setWithdrawing(true);

      const res = await fetch("/api/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: withdrawAddress,
          amount: amountMicro.toString(),
          pubKey: stxPubKey,
        }),
      });

      const data: { error?: string } = await res.json(); 

      if (!res.ok) throw new Error(data.error || "Transaction failed");

      setToast({ type: "success", message: "Transaction successful!" });
      setWithdrawAddress("");
      setAmount(0);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Transaction failed"; 
      setToast({ type: "error", message });
    } finally {
      setWithdrawing(false);
    }
  };

  // auto-hide toast after 3 seconds
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 relative">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Withdraw STX</h3>

      {/* for toast */}
      {toast && (
        <div
          className={`absolute top-4 right-4 px-4 py-2 rounded shadow-md text-white font-semibold transition-all
            ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}
        >
          {toast.message}
        </div>
      )}

      <div className="space-y-4">
        <input
          type="text"
          value={withdrawAddress}
          onChange={(e) => setWithdrawAddress(e.target.value)}
          placeholder="Enter recipient STX address"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <input
          type="number"
          step="0.000001"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Enter amount in STX"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button
          onClick={handleWithdrawStacks}
          disabled={withdrawing}
          className="w-full px-6 py-3 rounded-xl text-white font-semibold bg-purple-600 hover:bg-purple-700 shadow-md transition-colors duration-200 disabled:opacity-50"
        >
          {withdrawing ? "Withdrawing..." : "Withdraw STX"}
        </button>
      </div>
    </section>
  );
}
