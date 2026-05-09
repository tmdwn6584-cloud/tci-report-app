"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { questions } from "@/data/questions";

const CHOICES = [
  { value: 1, label: "전혀 아니다" },
  { value: 2, label: "아니다" },
  { value: 3, label: "그렇다" },
  { value: 4, label: "매우 그렇다" },
];

function TestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const name = searchParams.get("n") || "사용자";
  const gender = searchParams.get("g") || "";
  const age = searchParams.get("age") || "";
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const handleSelect = (value: number) => {
    const newAnswers = [...answers, value];
    
    if (currentIndex < questions.length - 1) {
      setAnswers(newAnswers);
      setCurrentIndex((prev) => prev + 1);
    } else {
      const answerString = newAnswers.join("");
      const params = new URLSearchParams({
        n: name,
        g: gender,
        age: age,
        a: answerString
      });
      router.push(`/result?${params.toString()}`);
    }
  };

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen flex flex-col p-6 items-center justify-center relative overflow-hidden">
      <div className="w-full max-w-xl z-10 flex flex-col h-[70vh] justify-between">
        
        <div className="mb-8">
          <div className="flex justify-between items-end mb-2">
            <span className="text-purple-600 font-semibold text-sm">
              {name}님을 위한 문항
            </span>
            <span className="text-xs text-gray-400 font-medium">{currentIndex + 1} / {questions.length}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <motion.div 
              className="bg-purple-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>

        <div className="flex-grow flex flex-col justify-center relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <h2 className="text-2xl md:text-3xl font-medium text-gray-800 leading-relaxed break-keep">
                {currentQuestion.text}
              </h2>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex flex-col gap-3 mt-12">
          {CHOICES.map((choice) => (
            <motion.button
              key={choice.value}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleSelect(choice.value)}
              className="w-full py-4 px-6 rounded-2xl bg-white border border-gray-100 shadow-sm text-gray-700 font-medium hover:border-purple-300 hover:bg-purple-50 transition-colors text-left flex justify-between items-center group"
            >
              <span>{choice.label}</span>
              <div className="w-4 h-4 rounded-full border border-gray-300 group-hover:border-purple-500 group-hover:bg-purple-100" />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TestPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fdfbf7]" />}>
      <TestContent />
    </Suspense>
  );
}
