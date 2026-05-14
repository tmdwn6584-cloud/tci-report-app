"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [mode, setMode] = useState<"full" | "lite">("full");

  const handleStart = () => {
    if (!name.trim()) {
      alert("이름이나 닉네임을 입력해주세요.");
      return;
    }
    if (!gender) {
      alert("성별을 선택해주세요.");
      return;
    }
    if (!age || isNaN(Number(age))) {
      alert("정확한 나이를 입력해주세요.");
      return;
    }
    
    const params = new URLSearchParams({
      n: name,
      g: gender,
      age: age,
      mode,
    });
    
    router.push(`/test?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-6 relative overflow-hidden bg-[#fdfbf7] w-full max-w-[100vw] overflow-x-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[70%] rounded-full bg-purple-200/30 blur-[100px] md:blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[90%] h-[80%] rounded-full bg-blue-100/30 blur-[100px] md:blur-[120px]" />
        <div className="absolute top-[20%] right-[10%] md:right-[20%] w-[50%] h-[40%] rounded-full bg-pink-100/20 blur-[80px] md:blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-xl z-10 mx-auto"
      >
        <div className="bg-white/60 backdrop-blur-xl border border-white p-6 md:p-14 rounded-[2rem] md:rounded-[2.5rem] shadow-[0_8px_40px_rgb(0,0,0,0.03)] text-center w-full">
          <div className="inline-block px-3 py-1.5 md:px-4 rounded-full bg-purple-50 text-purple-600 text-[10px] md:text-xs font-semibold tracking-wider mb-6 md:mb-8">
            PREMIUM EMOTIONAL INSIGHT
          </div>
          
          <h1 className="text-2xl md:text-4xl font-light text-gray-800 mb-4 md:mb-6 leading-snug md:leading-tight tracking-tight break-keep">
            당신의 성격이 아니라,<br />
            당신의 <span className="font-semibold bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">감정 흐름</span>을 읽습니다.
          </h1>
          
          <p className="text-gray-500 mb-8 md:mb-10 text-sm md:text-lg font-light leading-relaxed break-keep">
            왜 특정 관계를 오래 못 놓는지,<br className="hidden md:block" />
            당신의 심리 구조 안에서 다정하게 설명해 드립니다.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-left w-full">
            <button
              type="button"
              onClick={() => setMode("full")}
              className={`w-full rounded-3xl border px-5 py-4 text-left transition-all ${mode === "full" ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-transparent shadow-lg' : 'bg-white/90 border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50'}`}
            >
              <div className="text-sm font-semibold">정밀 검사</div>
              <div className="mt-2 text-xs text-gray-500">180문항 · 약 15분</div>
            </button>
            <button
              type="button"
              onClick={() => setMode("lite")}
              className={`w-full rounded-3xl border px-5 py-4 text-left transition-all ${mode === "lite" ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-transparent shadow-lg' : 'bg-white/90 border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50'}`}
            >
              <div className="text-sm font-semibold">빠른 검사</div>
              <div className="mt-2 text-xs text-gray-500">20문항 · 약 3분</div>
            </button>
          </div>

          <div className="flex flex-col gap-4 md:gap-5 mb-8 md:mb-10 text-left w-full">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2 ml-1 tracking-wide uppercase">Name</label>
              <input 
                type="text" 
                placeholder="이름 (닉네임)" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-white/80 border border-gray-100 focus:border-purple-300 focus:ring-4 focus:ring-purple-50 outline-none transition-all placeholder:text-gray-300 font-light"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2 ml-1 tracking-wide uppercase">Gender</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setGender('여성')}
                    className={`flex-1 py-4 rounded-2xl border transition-all font-light ${gender === '여성' ? 'bg-purple-50 border-purple-300 text-purple-700 font-medium' : 'bg-white/80 border-gray-100 text-gray-400 hover:bg-gray-50'}`}
                  >
                    여성
                  </button>
                  <button 
                    onClick={() => setGender('남성')}
                    className={`flex-1 py-4 rounded-2xl border transition-all font-light ${gender === '남성' ? 'bg-purple-50 border-purple-300 text-purple-700 font-medium' : 'bg-white/80 border-gray-100 text-gray-400 hover:bg-gray-50'}`}
                  >
                    남성
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2 ml-1 tracking-wide uppercase">Age</label>
                <input 
                  type="number" 
                  placeholder="나이" 
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                  className="w-full px-5 py-4 rounded-2xl bg-white/80 border border-gray-100 focus:border-purple-300 focus:ring-4 focus:ring-purple-50 outline-none transition-all placeholder:text-gray-300 font-light"
                />
              </div>
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStart}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-medium py-4 px-8 rounded-2xl shadow-[0_8px_20px_rgb(147,51,234,0.2)] transition-all flex items-center justify-center group"
          >
            <span className="tracking-wide">{mode === 'full' ? '정밀 검사 시작하기' : '빠른 검사 시작하기'}</span>
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform opacity-80" />
          </motion.button>
          
          <div className="mt-6 text-xs text-gray-400 font-light flex justify-center gap-4 tracking-wider">
            <span>{mode === 'full' ? '총 180문항' : '총 20문항'}</span>
            <span className="opacity-50">|</span>
            <span>{mode === 'full' ? '약 15분 소요' : '약 3분 소요'}</span>
          </div>
          
          <div className="mt-10 text-[10px] md:text-xs text-gray-400/80 font-light leading-relaxed break-keep px-4">
            <p>TCI의 7개 기질 구조를 참고해 제작된 감정 흐름 분석 검사입니다.</p>
            <p className="mt-1">의학적 진단 목적이 아닌 자기이해 기반 감정 흐름 분석 리포트입니다.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
