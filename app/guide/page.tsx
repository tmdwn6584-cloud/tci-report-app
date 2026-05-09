"use client";

import { motion } from "framer-motion";
import { Sparkles, Heart, Shield, RefreshCw } from "lucide-react";

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-[#fdfbf7] p-4 md:p-12 relative overflow-hidden flex items-center justify-center w-full max-w-[100vw] overflow-x-hidden">
      {/* Background blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[60%] rounded-full bg-purple-200/40 blur-[80px] md:blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[50%] rounded-full bg-blue-100/50 blur-[80px] md:blur-[100px] pointer-events-none" />

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 relative z-10 pt-10 md:pt-0">
        
        {/* Left Side: Dreamy Illustration Area */}
        <div className="md:col-span-5 flex flex-col justify-center w-full">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:sticky md:top-24 text-center md:text-left"
          >
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-100 to-lavender-200 rounded-2xl flex items-center justify-center mb-6 md:mb-8 shadow-sm mx-auto md:mx-0">
              <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-purple-500" />
            </div>
            <h1 className="text-2xl md:text-5xl font-light text-gray-800 leading-snug md:leading-tight mb-4 md:mb-6 tracking-tight break-keep">
              이 검사는<br />
              <span className="font-semibold text-purple-700">당신의 감정 흐름</span>을<br className="hidden md:block" />
              읽기 위한 여정입니다.
            </h1>
            <p className="text-lg text-gray-500 font-light leading-relaxed mb-8">
              당신을 평가하거나 특정 유형에 가두기 위한 것이 아닙니다. 
              스스로를 더 깊이 이해하고, 관계 속에서 편안해지기 위한 
              프리미엄 감정 리포트를 준비했습니다.
            </p>
            
            <div className="hidden md:block w-full h-64 bg-gradient-to-tr from-purple-50 to-blue-50/30 rounded-3xl border border-white/60 shadow-sm backdrop-blur-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-200/50 rounded-full blur-2xl"></div>
              <div className="absolute bottom-10 right-10 w-24 h-24 bg-blue-200/50 rounded-full blur-xl"></div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Guide Cards */}
        <div className="md:col-span-7 flex flex-col gap-4 md:gap-6 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/90 backdrop-blur-md p-6 md:p-10 rounded-[1.5rem] md:rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-white"
          >
            <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
              <div className="p-2.5 md:p-3 bg-purple-50 rounded-full"><Heart className="w-4 h-4 md:w-5 md:h-5 text-purple-600" /></div>
              <h2 className="text-lg md:text-xl font-bold text-gray-800">1. 무엇을 보는 검사인가요?</h2>
            </div>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed font-light break-keep">
              이 검사는 단순 성격 유형 검사가 아닙니다.<br/><br/>
              왜 특정 관계를 오래 못 놓는지, 왜 감정이 오래 남는지, 왜 말투 변화에 민감한지, 왜 혼자 오래 복기하는지 같은 <strong className="text-purple-700 font-medium">"감정 흐름"</strong>을 읽습니다.<br/><br/>
              당신의 성격을 단순 분류하기보다, 사람과 관계 안에서 어떤 방식으로 반응하고 흔들리는지를 섬세하게 분석합니다.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white/90 backdrop-blur-md p-6 md:p-10 rounded-[1.5rem] md:rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-white"
          >
            <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
              <div className="p-2.5 md:p-3 bg-blue-50 rounded-full"><RefreshCw className="w-4 h-4 md:w-5 md:h-5 text-blue-600" /></div>
              <h2 className="text-lg md:text-xl font-bold text-gray-800">2. 가장 자연스럽게 답변해주세요</h2>
            </div>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed font-light break-keep">
              이 검사에는 정답이 없습니다. "좋아 보이는 답"을 고르기보다는 아래의 기준을 떠올려주세요.<br/><br/>
              • 실제 관계에서의 반응<br/>
              • 감정이 올라오는 순간의 내 모습<br/>
              • 가장 가까운 사람 앞에서의 내 모습<br/><br/>
              머리로 계산한 답보다, 마음이 먼저 반응하는 쪽을 선택하실 때 가장 정확한 나만의 리포트가 완성됩니다.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/80 backdrop-blur-md p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-white relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-400 to-pink-300"></div>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-pink-50 rounded-full"><Shield className="w-5 h-5 text-pink-600" /></div>
              <h2 className="text-xl font-bold text-gray-800">3. 특정 사람을 떠올리면 결과가 달라집니다</h2>
            </div>
            <p className="text-gray-600 leading-relaxed font-light">
              현재 짝사랑하는 사람, 최근 감정적으로 크게 흔들렸던 관계, 혹은 특정한 누군가만을 집중해서 떠올리며 답변할 경우 평소의 내 기질보다 <strong>'감정 반응성'</strong>이 훨씬 과장되어 반영될 수 있습니다.<br/><br/>
              가능하면 특정 사건에 매몰되지 않은 <strong>"평소의 나"</strong>를 기준으로 답변해주세요.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white/80 backdrop-blur-md p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-white"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">4. 결과는 '좋고 나쁨'을 판단하지 않습니다</h2>
            <p className="text-gray-600 leading-relaxed font-light">
              점수가 높거나 낮은 것 자체에 좋고 나쁨은 없습니다. 각 점수는 단지 당신이 사람과 관계 안에서 어떤 방식으로 에너지를 쓰고 반응하는지를 보여주는 하나의 흐름일 뿐입니다.<br/><br/>
              이 결과는 당신을 평가하기 위한 것이 아니라, 스스로를 다독이고 더 깊이 이해하기 위한 따뜻한 참고 자료입니다.
            </p>
          </motion.div>
        </div>
        
      </div>
    </div>
  );
}
