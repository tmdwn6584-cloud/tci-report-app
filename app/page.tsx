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
      age: age
    });
    
    router.push(`/test?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-pastel-lavender opacity-40 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-pastel-blue opacity-30 blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-xl w-full z-10"
      >
        <div className="glass-card p-10 md:p-14 text-center">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-6 leading-tight tracking-tight">
            당신의 성격이 아니라,<br />
            당신의 <span className="text-purple-600">감정 흐름</span>을 읽습니다.
          </h1>
          
          <p className="text-gray-500 mb-8 text-lg font-light leading-relaxed">
            프리미엄 상담 수준의 심층 결과지를 받아보세요.
          </p>

          <div className="flex flex-col gap-4 mb-8 text-left">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">이름 (닉네임)</label>
              <input 
                type="text" 
                placeholder="이름을 입력하세요" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">성별</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setGender('여성')}
                    className={`flex-1 py-3 rounded-xl border transition-all ${gender === '여성' ? 'bg-purple-50 border-purple-400 text-purple-700 font-medium' : 'bg-white border-gray-200 text-gray-500'}`}
                  >
                    여성
                  </button>
                  <button 
                    onClick={() => setGender('남성')}
                    className={`flex-1 py-3 rounded-xl border transition-all ${gender === '남성' ? 'bg-purple-50 border-purple-400 text-purple-700 font-medium' : 'bg-white border-gray-200 text-gray-500'}`}
                  >
                    남성
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">나이</label>
                <input 
                  type="number" 
                  placeholder="나이 (숫자)" 
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStart}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-4 px-8 rounded-xl shadow-lg shadow-purple-500/30 transition-all flex items-center justify-center group"
          >
            <span>분석 시작하기</span>
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
          
          <div className="mt-6 text-sm text-gray-400 font-light flex justify-center gap-4">
            <span>49문항</span>
            <span>•</span>
            <span>약 10분 소요</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
