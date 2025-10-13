"use client";
import * as React from "react";
import { motion } from "framer-motion";

export default function OnChainProgress() {
  return (
    <section className="bg-gradient-to-b from-yellow-50 via-white to-orange-50 py-16 px-6 mt-12">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
          Show Your On-Chain Progress
        </h2>
        <p className="text-gray-700 text-lg md:text-xl">
          Join a community of Bitcoin learners and showcase your achievements.
        </p>

        <div className="mt-8 flex justify-center gap-4">
  <motion.a
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    href="https://discord.com"
    target="_blank"
    className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-sm transition-colors duration-300 hover:bg-blue-700"
  >
    Join Discord
  </motion.a>

  <motion.a
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    href="https://twitter.com"
    target="_blank"
    className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-sm transition-colors duration-300 hover:bg-blue-700"
  >
    Follow on X
  </motion.a>
</div>

      </div>
    </section>
  );
}
