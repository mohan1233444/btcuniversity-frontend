"use client";
import { useTurnkey } from "@turnkey/react-wallet-kit";
import * as React from "react";
import { motion } from "framer-motion";
import LearningPath from "./components/learningpath";
import OnChainProgress from "./components/OnChainProgress";

function HomePage(): React.JSX.Element {
  const { handleLogin } = useTurnkey();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-yellow-100 via-white to-orange-50 text-center relative overflow-hidden">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 bg-white/80 backdrop-blur-md border-b border-yellow-300 sticky top-0 z-20">
        <div className="flex items-center space-x-4">
          <img
            src="btcu-logo.png"
            alt="Bitcoin University Logo"
            className="w-12 h-12 rounded-full"
          />
          <div className="text-left">
            <h1 className="text-xl font-extrabold text-gray-900 tracking-wide">
              Bitcoin University
            </h1>
            <p className="text-xs text-gray-500 font-medium">Powered by Stacks</p>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-yellow-50 via-white to-orange-50 py-16 px-6 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="relative bg-white/90 backdrop-blur-lg p-12 rounded-3xl border border-yellow-200 max-w-2xl w-full space-y-8"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
            Learn <span className="text-orange-500">Bitcoin</span> by Doing
          </h1>

          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            Get Paid to Learn. Set up your wallet, earn rewards, and unlock your first on-chain certificate.
          </p>

          <div className="border-t border-yellow-200 my-6"></div>

          <p className="text-sm text-gray-500 tracking-wide">
            Start your Bitcoin journey with{" "}
            <span className="font-semibold text-gray-800">Syndicate Lab</span>
          </p>

          <motion.button
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleLogin()}
            className="relative inline-block px-12 py-4 bg-gradient-to-r from-orange-500 to-yellow-400 text-white text-lg font-bold rounded-2xl transition-all duration-300"
          >
            Start Learning 🚀
            <span className="absolute -bottom-1 -left-1 w-full h-full rounded-2xl bg-orange-200 opacity-20 blur-lg" />
          </motion.button>
        </motion.div>
      </div>

      {/* Learning Path Section */}
      <LearningPath />
      <OnChainProgress/>

      {/* Background Gradient Highlights */}
      <motion.div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(circle at 25% 25%, rgba(255,165,0,0.15), transparent 40%), radial-gradient(circle at 75% 75%, rgba(234,88,12,0.15), transparent 40%)",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

export default HomePage;
