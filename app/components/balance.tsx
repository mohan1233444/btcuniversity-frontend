"use client";

import React, { useEffect, useState } from "react";

interface BalanceProps {
  stxwallet: string;
  balance?: bigint; 
  loading?: boolean; 
}

export default function Balance({ stxwallet, balance: parentBalance, loading: parentLoading }: BalanceProps) {
  const [balance, setBalance] = useState<bigint>(0n); // micro-STX
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (parentBalance !== undefined) {
      setBalance(parentBalance);
      setLoading(parentLoading || false);
      return;
    }

    if (!stxwallet) return;

    const fetchBalance = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.hiro.so/extended/v1/address/${stxwallet}/balances?unanchored=true`
        );
        if (!res.ok) throw new Error("Failed to fetch balance");
        const data = await res.json();
        setBalance(BigInt(data.stx?.balance || "0"));
      } catch (error) {
        console.error("Error fetching STX balance:", error);
        setBalance(0n);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [stxwallet, parentBalance, parentLoading]);

  // Convert micro-STX to STX with 6 decimals
  const displayBalance = `${(balance / 1_000_000n).toString()}.${(balance % 1_000_000n)
    .toString()
    .padStart(6, "0")}`;

  return (
    <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">Balance</h3>
      <p className="text-3xl font-bold text-gray-900">
        {loading ? "Loading..." : `${displayBalance} STX`}
      </p>
    </section>
  );
}
