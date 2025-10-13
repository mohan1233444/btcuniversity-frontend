"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { BookOpen, Award, Users, Zap } from "lucide-react";

const COURSES_LIST = [
  {
    id: 1,
    emoji: "💰",
    title: "Start with Bitcoin",
    description:
      "Learn what Bitcoin is, how it works, and how to use it safely — even if you're brand new.",
  },
  {
    id: 2,
    emoji: "⚡",
    title: "Easy Bitcoin & Stacks",
    description:
      "A simple guide to understanding Bitcoin and the Stacks network — no tech skills needed!",
  },
  {
    id: 3,
    emoji: "🔗",
    title: "Bitcoin Made Simple",
    description:
      "Understand Bitcoin in plain language — how to buy, store, and use it with confidence.",
  },
  {
    id: 4,
    emoji: "🚀",
    title: "Intro to Stacks: Apps on Bitcoin",
    description:
      "Discover how people are building cool apps on Bitcoin using Stacks — explained step by step.",
  },
  {
    id: 5,
    emoji: "🧠",
    title: "From Zero to Bitcoin Hero",
    description:
      "Start from zero and learn the basics of Bitcoin, wallets, and how to join the new digital world.",
  },
];

export default function CoursesOverview() {
  const router = useRouter();

  return (
    <section className="bg-gradient-to-b from-white via-orange-50 to-yellow-50 py-16 px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
              Available Courses
            </h2>
            <p className="text-gray-700 text-lg md:text-xl mt-4">
              Choose from our curated Bitcoin and Stacks courses
            </p>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl p-6 border-2 border-orange-200 shadow-md text-center"
          >
            <BookOpen className="w-8 h-8 mx-auto text-orange-500 mb-2" />
            <div className="text-3xl font-bold text-gray-900">5</div>
            <div className="text-sm text-gray-600">Courses</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl p-6 border-2 border-yellow-200 shadow-md text-center"
          >
            <Users className="w-8 h-8 mx-auto text-yellow-600 mb-2" />
            <div className="text-3xl font-bold text-gray-900">1000+</div>
            <div className="text-sm text-gray-600">Students</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl p-6 border-2 border-green-200 shadow-md text-center"
          >
            <Award className="w-8 h-8 mx-auto text-green-600 mb-2" />
            <div className="text-3xl font-bold text-gray-900">NFT</div>
            <div className="text-sm text-gray-600">Certificates</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl p-6 border-2 border-purple-200 shadow-md text-center"
          >
            <Zap className="w-8 h-8 mx-auto text-purple-600 mb-2" />
            <div className="text-3xl font-bold text-gray-900">Free</div>
            <div className="text-sm text-gray-600">Get Started</div>
          </motion.div>
        </div>

        {/* Courses List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COURSES_LIST.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="bg-white rounded-3xl border-2 border-orange-200 p-6 shadow-lg hover:shadow-2xl hover:shadow-orange-100 transition-all"
            >
              <div className="text-5xl mb-4">{course.emoji}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {course.title}
              </h3>
              <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                {course.description}
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-orange-600 font-semibold">
                  Course {course.id}
                </span>
                <span className="text-green-600 font-semibold">0.01 sBTC</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/dashboard")}
            className="px-12 py-4 bg-gradient-to-r from-orange-500 to-yellow-400 text-white text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all"
          >
            Start Learning Today 🚀
          </motion.button>
        </div>
      </div>
    </section>
  );
}
