"use client";

import React from "react";
import { QRCodeSVG } from "qrcode.react";

interface WalletDisplayProps {
  stxwallet: string;
}

export default function WalletDisplay({ stxwallet }: WalletDisplayProps) {
  return (
    <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Your STX Wallet</h2>
      <ul className="space-y-2">
        <li className="bg-gray-50 p-3 rounded-md border border-gray-200 font-mono text-blue-700 break-words">
          {stxwallet || "create new stx wallet"}
        </li>
      </ul>

      {/* QR Code */}
      {stxwallet && (
        <div className="mt-4 flex justify-center">
          <QRCodeSVG value={stxwallet} size={128} bgColor="#ffffff" fgColor="#1D4ED8" />
        </div>
      )}
    </section>
  );
}
