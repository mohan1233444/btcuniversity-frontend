"use client";
import { useTurnkey } from "@turnkey/react-wallet-kit";
import * as React from "react";
import { motion } from "framer-motion";

function LoginButton(): React.JSX.Element {
  const { handleLogin } = useTurnkey();

  return (
    <div className="min-h-full flex flex-col items-center justify-center h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-100 text-center mb-2 relative overflow-hidden">

      {/* --- Navbar --- */}
      <nav className="absolute top-0 left-0 w-full flex items-center justify-between px-8 py-4 bg-white/50 backdrop-blur-md border-b border-yellow-200 z-20">
        <div className="flex items-center space-x-3">
          <img
            src="assets/btcu-logo.png"
            alt="Bitcoin University Logo"
            className="w-10 h-10 rounded-md shadow-sm"
          />
          <div className="text-left">
            <h1 className="text-xl font-bold text-gray-800">Bitcoin University</h1>
            <p className="text-xs text-gray-500">Powered by Stacks</p>
          </div>
        </div>
      </nav>

      {/* --- Center Login Card --- */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="z-10 bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-xl border border-yellow-200 max-w-lg w-full mx-4 space-y-8"
      >
        <h1 className="text-5xl font-bold text-gray-800">
          Learn <span className="text-orange-600">Bitcoin</span> by Doing
        </h1>

        <p className="text-lg text-gray-600 leading-relaxed">
          Get Paid to Learn. Set up your wallet, earn rewards, and unlock your first on-chain certificate.
        </p>

        <div className="border-t border-gray-200 my-4"></div>

        <p className="text-sm text-gray-500 tracking-wide">
          Start your Bitcoin journey with{" "}
          <span className="font-semibold text-gray-700">Bitcoin University</span>
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleLogin()}
          className="px-10 py-3 bg-orange-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-orange-700 transition-colors duration-200"
        >
          Start Learning 🚀
        </motion.button>
      </motion.div>

      {/* --- Animated Gradient Background --- */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,165,0,0.15),transparent_60%),radial-gradient(circle_at_80%_70%,rgba(234,88,12,0.15),transparent_60%)] pointer-events-none"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

export default function Home() {
  return <LoginButton />;
}
