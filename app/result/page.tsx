"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { questions } from "@/data/questions";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { Heart, Shield, Sparkles, Activity, Lock, Share2, Download as DownloadIcon } from "lucide-react";
import html2canvas from "html2canvas";

const dimensionMap = {
  NS: "자극추구", HA: "위험회피", RD: "사회적 민감성", P: "인내력",
  SD: "자율성", C: "연대감", ST: "자기초월"
};

const dimensionColors = {
  NS: "#60a5fa", HA: "#fb923c", RD: "#f472b6", P: "#4ade80",
  SD: "#2dd4bf", C: "#c084fc", ST: "#a78bfa"
};

const calculateScores = (answers: number[]) => {
  const scores = { NS: 0, HA: 0, RD: 0, P: 0, SD: 0, C: 0, ST: 0 };
  const counts = { NS: 0, HA: 0, RD: 0, P: 0, SD: 0, C: 0, ST: 0 };

  questions.forEach((q, idx) => {
    if (answers[idx] === undefined) return;
    let val = answers[idx];
    if (q.reverse) val = 5 - val;
    scores[q.dimension] += val;
    counts[q.dimension] += 1;
  });

  return Object.keys(scores).map((key) => {
    const k = key as keyof typeof scores;
    const avg = counts[k] > 0 ? (scores[k] / counts[k]) : 2.5;
    return { 
      key: k, 
      name: dimensionMap[k], 
      score: scores[k], 
      avg: avg.toFixed(2),
      avgNum: avg,
      color: dimensionColors[k]
    };
  });
};

function ResultContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get("n") || "사용자";
  const gender = searchParams.get("g") || "비공개";
  const age = searchParams.get("age") || "";
  const [data, setData] = useState<any[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'TCI 기반 심층 감정 흐름 분석',
          text: `${name}님의 프리미엄 감정 흐름 분석 결과를 확인해보세요!`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Share failed', err);
      }
    } else {
      // Fallback for desktop or unsupported browsers
      navigator.clipboard.writeText(window.location.href);
      alert('결과 링크가 클립보드에 복사되었습니다. 카카오톡에 붙여넣기 해주세요!');
    }
  };

  const handleDownloadImage = async () => {
    if (!resultRef.current) return;
    try {
      const canvas = await html2canvas(resultRef.current, { scale: 2, useCORS: true, backgroundColor: '#fdfbf7' });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `${name}_감정흐름분석.png`;
      link.click();
    } catch (err) {
      console.error('Image capture failed', err);
      alert('이미지 저장에 실패했습니다.');
    }
  };

  useEffect(() => {
    const a = searchParams.get("a");
    if (a) {
      const answers = a.split("").map(Number);
      const processed = calculateScores(answers);
      setData(processed);

      // Save to localStorage
      const history = JSON.parse(localStorage.getItem("tci_history") || "[]");
      const newEntry = {
        id: Date.now(), name, gender, age,
        date: new Date().toLocaleDateString('ko-KR'),
        answersString: a, data: processed
      };
      localStorage.setItem("tci_history", JSON.stringify([newEntry, ...history]));
    }
  }, [searchParams, name, gender, age]);

  if (data.length === 0) return <div className="min-h-screen bg-[#fdfbf7]" />;

  const top4 = [...data].sort((a, b) => b.avgNum - a.avgNum).slice(0, 4);

  return (
    <div className="pb-24 bg-[#fdfbf7] min-h-screen font-sans">
      <div ref={resultRef}>
        {/* Hero Section */}
        <div className="relative w-full h-[450px] overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/40 via-blue-50/30 to-pink-50/20"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-200/30 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>
        
        <div className="relative z-10 p-10 md:p-16 max-w-5xl mx-auto h-full flex flex-col justify-center items-center text-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/60 backdrop-blur border border-white/50 text-purple-600 text-xs font-semibold tracking-wider mb-6 shadow-sm">
            EMOTIONAL INSIGHT REPORT
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-light text-gray-800 mb-6 tracking-tight leading-tight"
          >
            <span className="font-semibold text-purple-700">{name}</span> 님의<br/>
            감정 흐름 분석 결과
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-500 font-light max-w-2xl leading-relaxed mb-8"
          >
            "가까워질수록 감정의 의미를 깊게 받아들이며,<br className="hidden md:block"/>
            관계의 미세한 거리감 변화에 예민하게 반응할 가능성이 있습니다."
          </motion.p>
          
          <div className="flex gap-4 text-sm">
            <span className="bg-white/50 backdrop-blur-md px-5 py-2 rounded-full text-gray-500 font-medium border border-white/40 shadow-sm">{gender}</span>
            {age && <span className="bg-white/50 backdrop-blur-md px-5 py-2 rounded-full text-gray-500 font-medium border border-white/40 shadow-sm">{age}세</span>}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-12 relative z-20">
        
        {/* Free Section: Top Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {top4.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }} 
              className="bg-white/80 backdrop-blur-lg p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-white"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: item.color }}>
                  <Heart className="w-4 h-4" />
                </div>
                <span className="font-semibold text-gray-700 text-sm">{item.name}</span>
              </div>
              <div className="text-3xl font-light text-gray-800 mb-1">{item.avg}</div>
              <p className="text-xs text-gray-400 font-medium tracking-wide">핵심 영향 요인</p>
            </motion.div>
          ))}
        </div>

        {/* Free Section: Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-50">
            <h3 className="text-lg font-bold text-gray-800 mb-6">감정·기질 프로파일</h3>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data.map(d => ({ subject: d.key, A: d.avgNum, name: d.name }))}>
                  <PolarGrid stroke="#f3f4f6" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                  <Radar name="Score" dataKey="A" stroke="#a855f7" fill="#e9d5ff" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-50">
            <h3 className="text-lg font-bold text-gray-800 mb-6">세부 지표</h3>
            <div className="flex flex-col gap-5">
              {data.map((item) => (
                <div key={item.key} className="flex items-center gap-4">
                  <div className="w-10 text-xs font-bold text-gray-400">{item.key}</div>
                  <div className="w-16 text-sm text-gray-600 font-medium">{item.name}</div>
                  <div className="flex-1 bg-gray-50 h-2 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(item.avgNum / 4) * 100}%`, backgroundColor: item.color }} />
                  </div>
                  <div className="w-8 text-right text-sm font-medium text-gray-800">{item.avg}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Free Section: Short Conclusion */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="bg-gradient-to-br from-purple-50 to-white p-8 md:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-purple-100/50 mb-12 text-center">
          <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-4">핵심 관계 패턴 분석</h3>
          <p className="text-gray-600 leading-relaxed font-light mb-2">
            겉으로는 안정적으로 상황을 이끌어가려 하지만,<br/>
            속으로는 상대방의 말이나 태도가 의미하는 바를 오래 곱씹는 경향이 있습니다.
          </p>
          <p className="text-gray-600 leading-relaxed font-light">
            갈등이 생겼을 때 바로 화를 내기보다 마음의 문을 먼저 닫아버림으로써 자신을 보호하려 합니다.
          </p>
        </motion.div>

        {/* Full Report Section */}
        <div className="relative">
          <div className="bg-white p-10 md:p-14 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-50 text-gray-800 prose prose-purple max-w-none prose-p:font-light prose-p:leading-loose">
            
            <div className="text-center mb-16">
              <span className="text-purple-600 font-semibold tracking-widest text-sm mb-4 block">DEEP ANALYSIS</span>
              <h2 className="text-2xl md:text-3xl font-light text-gray-800">
                왜 이런 감정 흐름이 반복되는 걸까요?
              </h2>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mt-10 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm">1</span>
              숨겨진 감정 피로 구조
            </h3>
            <p>
              {name}님은 기본적으로 다른 사람들의 감정선에 잘 맞춰주는 편입니다. 하지만 이것이 본인이 편해서라기보다, 
              "관계가 어색해지거나 갈등이 생기는 상황 자체를 피로하게 느끼기 때문"일 가능성이 큽니다. 
              따라서 남들이 보기에는 성격이 좋아 보일 수 있지만, 정작 혼자 있을 때는 사람을 만나는 것 자체가 
              막대한 에너지 소모로 다가오곤 합니다.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mt-12 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">2</span>
              관계 거리감 민감도
            </h3>
            <p>
              매우 특징적인 부분은, 타인과의 '심리적 거리감'이 조금이라도 달라지는 것을 귀신같이 캐치한다는 점입니다. 
              어제까지 다정했던 사람이 오늘 미묘하게 온도가 낮아지면, 그 이유를 내 안에서 찾으려 하며 하루 종일 그 생각에 
              사로잡힐 수 있습니다. 이는 사람에 대한 집착이 아니라, 내 환경의 '예측 가능성'이 깨진 것에 대한 불안 반응입니다.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mt-12 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-sm">3</span>
              왜 특정 관계를 오래 못 놓을까?
            </h3>
            <p>
              논리적으로는 끝난 관계라는 것을 알면서도 마음이 쉽게 정리되지 않는 이유는, 그 사람이 특별해서라기보다 
              "내가 온전히 마음을 열고 안심했던 그 상태" 자체를 상실하는 것이 두렵기 때문입니다. 
              {name}님에게 누군가에게 마음을 푹 놓는다는 것은 엄청난 에너지가 필요한 일이기 때문에, 
              그 베이스캠프가 사라지는 것에 대한 심리적 저항감이 매우 크게 나타납니다.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mt-12 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm">4</span>
              나를 지키는 방어 기제
            </h3>
            <p>
              상처를 받았을 때 화를 내거나 따지기보다는, 조용히 마음속으로 선을 긋고 상대방에 대한 기대를 거두는 방식을 취합니다. 
              겉으로는 평소와 다름없이 대하지만 속으로는 이미 수천 킬로미터 멀어져 있는 상태입니다. 
              이는 갈등으로 인한 추가적인 감정 소모를 막기 위한 가장 안전하고도 슬픈 방어 기제입니다.
            </p>
            
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-8 md:p-10 rounded-3xl border border-purple-100 mt-16 text-center">
              <h4 className="font-bold text-purple-900 mb-4">Therapist's Note</h4>
              <p className="text-purple-800/80 text-sm md:text-base">
                {name}님, 당신은 너무 많은 것을 담아두고 스스로 소화하려 애쓰고 있습니다.<br/>
                때로는 상대방의 감정을 책임지려는 그 무거운 짐을 내려놓으셔도 괜찮습니다.<br/>
                당신의 감정 흐름은 예민한 것이 아니라, 그만큼 세상을 섬세하게 느끼는 아름다운 능력입니다.
              </p>
            </div>

          </div>
        </div>
      </div>
        
      {/* Share and Download Buttons */}
        <div className="mt-12 flex flex-col md:flex-row gap-4 justify-center">
          <button 
            onClick={handleShare}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-[#FEE500] hover:bg-[#FDD800] text-[#3C1E1E] font-semibold rounded-2xl shadow-sm transition-all"
          >
            <Share2 className="w-5 h-5" />
            카카오톡으로 결과 공유하기
          </button>
          
          <button 
            onClick={handleDownloadImage}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold rounded-2xl shadow-sm transition-all"
          >
            <DownloadIcon className="w-5 h-5" />
            이미지로 저장하기
          </button>
        </div>

      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fdfbf7]" />}>
      <ResultContent />
    </Suspense>
  );
}
