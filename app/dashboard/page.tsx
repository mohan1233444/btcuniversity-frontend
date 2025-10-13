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
import {
  ArrowUpRight,
  BookOpen,
  GraduationCap,
  Wallet,
  TrendingUp,
  Award,
} from "lucide-react";
import { motion } from "framer-motion";

// Import components
import Header from "../components/header";
import CreateWallet from "../components/createWallet";
import WalletDisplay from "../components/displayWallet";
import Balance from "../components/balance";
import ExportWallet from "../components/exportwallet";
import WithdrawSTX from "../components/withdrawwallet";

const COURSES = [
  {
    id: 1,
    title: "Start with Bitcoin",
    description:
      "Learn what Bitcoin is, how it works, and how to use it safely",
    emoji: "💰",
    price: "0.01 sBTC",
    duration: "2 hours",
  },
  {
    id: 2,
    title: "Easy Bitcoin & Stacks",
    description:
      "A simple guide to understanding Bitcoin and the Stacks network",
    emoji: "⚡",
    price: "0.01 sBTC",
    duration: "3 hours",
  },
  {
    id: 3,
    title: "Bitcoin Made Simple",
    description:
      "Understand Bitcoin in plain language — how to buy, store, and use it",
    emoji: "🔗",
    price: "0.01 sBTC",
    duration: "2.5 hours",
  },
  {
    id: 4,
    title: "Intro to Stacks: Apps on Bitcoin",
    description:
      "Discover how people are building cool apps on Bitcoin using Stacks",
    emoji: "🚀",
    price: "0.01 sBTC",
    duration: "4 hours",
  },
  {
    id: 5,
    title: "From Zero to Bitcoin Hero",
    description:
      "Start from zero and learn the basics of Bitcoin, wallets, and more",
    emoji: "🧠",
    price: "0.01 sBTC",
    duration: "5 hours",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const { authState, wallets } = useTurnkey();
  const [stxAddress, setStxAddress] = useState("");
  const [stxPubKey, setStxPubKey] = useState("");
  const [stxBalance, setStxBalance] = useState<bigint>(0n);
  const [sbtcBalance, setSbtcBalance] = useState<bigint>(0n);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState<Set<number>>(
    new Set()
  );
  const [isWhitelisted, setIsWhitelisted] = useState(false);
  const [showWalletActions, setShowWalletActions] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (authState !== "authenticated") router.push("/");
  }, [authState, router]);

  // Get STX wallet address and public key
  useEffect(() => {
    const account = wallets?.[0]?.accounts?.[0];
    const pubKey = account?.publicKey;

    if (pubKey) {
      setStxPubKey(pubKey);
      try {
        const address = publicKeyToAddress(pubKey, "testnet");
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
        const stxRes = await fetch(
          `https://api.testnet.hiro.so/extended/v1/address/${stxAddress}/balances?unanchored=true`
        );
        if (!stxRes.ok) throw new Error("Failed to fetch STX balance");
        const stxData = await stxRes.json();
        setStxBalance(BigInt(stxData.stx?.balance || "0"));

        const sbtcContractAddress =
          process.env.NEXT_PUBLIC_SBTC_CONTRACT_ADDRESS!;
        const sbtcContractName = process.env.NEXT_PUBLIC_SBTC_CONTRACT_NAME!;

        const sbtcCv = await fetchCallReadOnlyFunction({
          contractAddress: sbtcContractAddress,
          contractName: sbtcContractName,
          functionName: "get-balance-available",
          functionArgs: [Cl.principal(stxAddress)],
          senderAddress: stxAddress,
          network: STACKS_TESTNET,
        });

        const sbtcValue = cvToValue(sbtcCv) as any;
        const balance = sbtcValue?.value || 0;
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

  // Check whitelist and enrollments
  useEffect(() => {
    if (!stxAddress) return;

    const checkStatus = async () => {
      try {
        const whitelistRes = await fetch("/api/contract/check-whitelist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address: stxAddress }),
        });
        const whitelistData = await whitelistRes.json();
        if (whitelistData.success) {
          setIsWhitelisted(whitelistData.isWhitelisted);
        }

        if (whitelistData.isWhitelisted) {
          const enrollRes = await fetch("/api/contract/get-enrolled-ids", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ address: stxAddress }),
          });
          const enrollData = await enrollRes.json();
          if (enrollData.success && enrollData.enrolledIds) {
            setEnrolledCourses(new Set<number>(enrollData.enrolledIds));
          }
        }
      } catch (err) {
        console.error("Status check failed:", err);
      }
    };

    checkStatus();
  }, [stxAddress]);

  if (authState !== "authenticated") return null;

  const balanceInStx = Number(stxBalance) / 1_000_000;
  const balanceInSbtc = Number(sbtcBalance) / 100_000_000;
  const totalValueUSD = balanceInStx * 0.5 + balanceInSbtc * 95000; // Mock USD values

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Header />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {wallets.length === 0 ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <CreateWallet />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Portfolio Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl p-8 text-white"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-orange-100 text-sm mb-2">Total Balance</p>
                  <h2 className="text-5xl font-bold">
                    ${totalValueUSD.toFixed(2)}
                  </h2>
                  <p className="text-orange-100 text-sm mt-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    +0.00% (24h)
                  </p>
                </div>
                <button
                  onClick={() => setShowWalletActions(!showWalletActions)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors backdrop-blur-sm"
                >
                  <Wallet className="w-5 h-5" />
                  Manage
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-orange-100 text-sm">STX</p>
                      <p className="text-2xl font-bold mt-1">
                        {loadingBalance ? "..." : balanceInStx.toFixed(6)}
                      </p>
                    </div>
                    <img src="/stx.png" alt="STX" className="w-10 h-10" />
                  </div>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-orange-100 text-sm">sBTC</p>
                      <p className="text-2xl font-bold mt-1">
                        {loadingBalance ? "..." : balanceInSbtc.toFixed(8)}
                      </p>
                    </div>
                    <img src="/sbtc.avif" alt="sBTC" className="w-10 h-10" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Wallet Actions Expandable */}
            {showWalletActions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-4 bg-gray-50 rounded-2xl p-6"
              >
                <WalletDisplay stxwallet={stxAddress} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ExportWallet wallets={wallets} />
                  <WithdrawSTX stxPubKey={stxPubKey} balance={stxBalance} />
                </div>
              </motion.div>
            )}

            {/* Learning Progress */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-3 rounded-xl">
                    <GraduationCap className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Your Learning Journey
                    </h3>
                    <p className="text-sm text-gray-600">
                      {enrolledCourses.size} of {COURSES.length} courses
                      enrolled
                    </p>
                  </div>
                </div>
                {!isWhitelisted && (
                  <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-semibold">
                    Whitelist Required
                  </span>
                )}
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>
                    {Math.round((enrolledCourses.size / COURSES.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-yellow-400 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        (enrolledCourses.size / COURSES.length) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Courses Grid */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Available Courses
                </h3>
                <button className="text-orange-600 hover:text-orange-700 text-sm font-semibold flex items-center gap-1">
                  View All
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {COURSES.map((course) => {
                  const isEnrolled = enrolledCourses.has(course.id);

                  return (
                    <motion.div
                      key={course.id}
                      whileHover={{ y: -4 }}
                      onClick={() => router.push(`/course/${course.id}`)}
                      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="bg-gray-100 group-hover:bg-orange-100 transition-colors p-3 rounded-xl text-2xl">
                          {course.emoji}
                        </div>
                        {isEnrolled && (
                          <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                            Enrolled
                          </div>
                        )}
                      </div>

                      <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                        {course.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {course.description}
                      </p>

                      {isEnrolled ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/course/${course.id}`);
                          }}
                          className="w-full py-2 bg-gradient-to-r from-orange-500 to-yellow-400 text-white text-sm font-bold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                          View Course
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">
                            {course.duration}
                          </span>
                          <span className="font-semibold text-orange-600">
                            {course.price}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
