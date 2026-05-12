"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { questions } from "@/data/questions";
import { Suspense } from "react";

const CHOICES = [
  { value: 1, label: "전혀 아니다" },
  { value: 2, label: "아니다" },
  { value: 3, label: "그렇다" },
  { value: 4, label: "매우 그렇다" },
];

const PAGE_SIZE = 5;
const MAX_QUESTIONS = 180;
const testQuestions = questions.slice(0, MAX_QUESTIONS);

function TestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const name = searchParams.get("n") || "사용자";
  const gender = searchParams.get("g") || "";
  const age = searchParams.get("age") || "";
  
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(testQuestions.length).fill(0));

  const totalPages = Math.ceil(testQuestions.length / PAGE_SIZE);
  const startIdx = currentPage * PAGE_SIZE;
  const currentQuestions = testQuestions.slice(startIdx, startIdx + PAGE_SIZE);
  const progress = ((currentPage + 1) / totalPages) * 100;

  const handleSelect = (questionIndex: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[startIdx + questionIndex] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    // Check if all current page questions are answered
    const isAllAnswered = currentQuestions.every((_, idx) => answers[startIdx + idx] !== 0);
    
    if (!isAllAnswered) {
      alert("모든 문항에 답변해 주세요.");
      return;
    }

    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const answerString = answers.join("");
      const params = new URLSearchParams({
        n: name,
        g: gender,
        age: age,
        a: answerString
      });
      router.push(`/result?${params.toString()}`);
    }
  };

  const handleBack = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isCurrentPageComplete = currentQuestions.every((_, idx) => answers[startIdx + idx] !== 0);

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-6 items-center bg-[#fdfbf7] w-full max-w-full overflow-x-hidden">
      <div className="w-full max-w-2xl z-10 flex flex-col pt-4 md:pt-10 pb-24 md:pb-24">
        
        <div className="mb-6 md:mb-10 sticky top-0 bg-[#fdfbf7]/95 backdrop-blur-md pt-2 pb-4 md:pt-4 md:pb-6 z-20">
          <div className="flex justify-between items-end mb-3">
            <span className="text-purple-600 font-semibold text-sm tracking-wide">
              {name}님의 감정 흐름 분석 중
            </span>
            <span className="text-xs text-gray-400 font-medium">{currentPage + 1} / {totalPages} 페이지</span>
          </div>
          <div className="w-full bg-purple-100/50 rounded-full h-2 overflow-hidden">
            <motion.div 
              className="bg-gradient-to-r from-purple-400 to-indigo-400 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-10"
            >
              {currentQuestions.map((q, idx) => {
                const globalIdx = startIdx + idx;
                const isAnswered = answers[globalIdx] !== 0;
                
                return (
                  <div key={q.id} className={`p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border transition-all duration-300 w-full ${isAnswered ? 'bg-white/95 border-purple-200 shadow-[0_8px_30px_rgb(147,51,234,0.06)]' : 'bg-white/70 border-gray-100 shadow-sm'}`}>
                    <h2 className="text-base md:text-xl font-medium text-gray-800 leading-relaxed mb-6 break-keep">
                      <span className="text-purple-400 font-bold mr-2 text-sm md:text-lg">{globalIdx + 1}.</span>
                      {q.text}
                    </h2>
                    
                    <div className="grid grid-cols-2 md:flex md:flex-row gap-2 md:gap-3">
                      {CHOICES.map((choice) => {
                        const isSelected = answers[globalIdx] === choice.value;
                        return (
                          <button
                            key={choice.value}
                            onClick={() => handleSelect(idx, choice.value)}
                            className={`flex-1 py-4 px-2 rounded-2xl text-xs md:text-sm transition-all border font-medium whitespace-pre-wrap break-keep leading-snug ${
                              isSelected 
                                ? 'bg-purple-50 border-purple-400 text-purple-700 shadow-sm ring-1 ring-purple-400' 
                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-purple-200'
                            }`}
                          >
                            {choice.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-12 flex justify-between items-center gap-4">
          <button 
            onClick={handleBack}
            disabled={currentPage === 0}
            className={`flex items-center justify-center gap-2 px-6 py-4 rounded-2xl transition-all font-medium flex-1 ${
              currentPage === 0 
                ? 'opacity-0 pointer-events-none' 
                : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-purple-600'
            }`}
          >
            이전 페이지
          </button>
          
          <button 
            onClick={handleNext}
            className={`flex items-center justify-center gap-2 px-6 py-4 rounded-2xl transition-all font-medium flex-[2] text-white shadow-md ${
              isCurrentPageComplete
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 shadow-purple-500/20'
                : 'bg-gray-300 shadow-none'
            }`}
          >
            {currentPage === totalPages - 1 ? '결과 확인하기' : '다음 페이지'}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
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
