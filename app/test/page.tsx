"use client";

import { useEffect, useRef, useState } from "react";
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

function TestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const name = searchParams.get("n") || "사용자";
  const gender = searchParams.get("g") || "";
  const age = searchParams.get("age") || "";
  const mode = searchParams.get("mode") === "lite" ? "lite" : "full";
  const maxQuestions = mode === "lite" ? 20 : 180;
  const testQuestions = questions.slice(0, maxQuestions);
  
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(testQuestions.length).fill(0));
  const [questionTimes, setQuestionTimes] = useState<number[]>(new Array(testQuestions.length).fill(0));
  const [questionStartTimes, setQuestionStartTimes] = useState<number[]>(new Array(testQuestions.length).fill(0));
  const [sessionId, setSessionId] = useState("");
  const [startedAt, setStartedAt] = useState("");

  const totalPages = Math.ceil(testQuestions.length / PAGE_SIZE);
  const startIdx = currentPage * PAGE_SIZE;
  const currentQuestions = testQuestions.slice(startIdx, startIdx + PAGE_SIZE);
  const progress = ((currentPage + 1) / totalPages) * 100;

  useEffect(() => {
    if (!sessionId) {
      const existing = sessionStorage.getItem("tciSessionId");
      const newId = existing || crypto.randomUUID();
      sessionStorage.setItem("tciSessionId", newId);
      setSessionId(newId);
    }

    if (!startedAt) {
      setStartedAt(new Date().toISOString());
    }

    setQuestionStartTimes((prev) => {
      const next = [...prev];
      for (let i = 0; i < PAGE_SIZE && i < testQuestions.length; i += 1) {
        if (!next[i]) next[i] = Date.now();
      }
      return next;
    });
  }, [sessionId, startedAt, testQuestions.length]);

  useEffect(() => {
    const handleUnload = () => {
      if (!sessionId) return;
      const payload = {
        type: "progress",
        sessionId,
        name,
        gender,
        age,
        mode,
        status: "incomplete",
        startedAt,
        currentQuestionIndex: currentPage * PAGE_SIZE + currentQuestions.length - 1,
        answersString: answers.join(""),
        questionTimes,
      };
      const body = JSON.stringify(payload);
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/results", body);
      }
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [sessionId, name, gender, age, mode, startedAt, currentPage, currentQuestions.length, answers, questionTimes]);

  const saveSession = async (payload: any) => {
    try {
      await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error("Failed to save session", error);
    }
  };

  const handleSelect = async (questionIndex: number, value: number) => {
    const globalIdx = startIdx + questionIndex;
    const newAnswers = [...answers];
    newAnswers[globalIdx] = value;

    const now = Date.now();
    const elapsed = questionStartTimes[globalIdx]
      ? Number(((now - questionStartTimes[globalIdx]) / 1000).toFixed(2))
      : 0;

    const newTimes = [...questionTimes];
    newTimes[globalIdx] = elapsed;

    setAnswers(newAnswers);
    setQuestionTimes(newTimes);
    setQuestionStartTimes((prev) => {
      const next = [...prev];
      next[globalIdx] = now;
      return next;
    });

    await saveSession({
      type: "progress",
      sessionId,
      name,
      gender,
      age,
      mode,
      status: "incomplete",
      startedAt,
      currentQuestionIndex: globalIdx,
      answersString: newAnswers.join(""),
      questionTimes: newTimes,
    });
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
      setQuestionStartTimes((prev) => {
        const next = [...prev];
        const nextPageStart = (currentPage + 1) * PAGE_SIZE;
        for (let i = 0; i < PAGE_SIZE && nextPageStart + i < testQuestions.length; i += 1) {
          if (!next[nextPageStart + i]) next[nextPageStart + i] = Date.now();
        }
        return next;
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });

      saveSession({
        type: "progress",
        sessionId,
        name,
        gender,
        age,
        mode,
        status: "incomplete",
        startedAt,
        currentQuestionIndex: startIdx + currentQuestions.length - 1,
        answersString: answers.join(""),
        questionTimes,
      });
    } else {
      const answerString = answers.join("");
      const finishedAt = new Date().toISOString();
      saveSession({
        type: "complete",
        sessionId,
        name,
        gender,
        age,
        mode,
        status: "completed",
        startedAt,
        finishedAt,
        currentQuestionIndex: maxQuestions - 1,
        answersString: answerString,
        questionTimes,
      });
      const params = new URLSearchParams({
        n: name,
        g: gender,
        age: age,
        mode,
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
          <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-end mb-3">
            <span className="text-purple-600 font-semibold text-sm tracking-wide">
              {name}님의 {mode === 'lite' ? '빠른 검사' : '정밀 검사'} 분석 중
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
