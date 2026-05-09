"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { questions } from "@/data/questions";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { Heart, Shield, Sparkles, Leaf, Activity } from "lucide-react";

const dimensionMap = {
  NS: "자극추구", HA: "위험회피", RD: "사회적 민감성", P: "인내력",
  SD: "자율성", C: "연대감", ST: "자기초월"
};

const dimensionColors = {
  NS: "#3b82f6", HA: "#f97316", RD: "#ec4899", P: "#22c55e",
  SD: "#06b6d4", C: "#a855f7", ST: "#8b5cf6"
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

  const processed = Object.keys(scores).map((key) => {
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

  return processed;
};

export default function ResultPage() {
  const searchParams = useSearchParams();
  const name = searchParams.get("n") || "사용자";
  const gender = searchParams.get("g") || "비공개";
  const age = searchParams.get("age") || "";
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const a = searchParams.get("a");
    if (a) {
      const answers = a.split("").map(Number);
      const processed = calculateScores(answers);
      setData(processed);

      // Save to localStorage
      const history = JSON.parse(localStorage.getItem("tci_history") || "[]");
      // Check if this run is already saved (basic duplicate prevention by timestamp can't be used here directly, but we just save blindly for now)
      const newEntry = {
        id: Date.now(),
        name,
        gender,
        age,
        date: new Date().toLocaleDateString('ko-KR'),
        answersString: a,
        data: processed
      };
      localStorage.setItem("tci_history", JSON.stringify([newEntry, ...history]));
    }
  }, [searchParams, name, gender, age]);

  if (data.length === 0) return <div className="min-h-screen bg-[#fdfbf7]" />;

  // Get top 4 dimensions
  const top4 = [...data].sort((a, b) => b.avgNum - a.avgNum).slice(0, 4);

  return (
    <div className="pb-24">
      {/* Hero Section */}
      <div className="relative w-full h-[380px] bg-cover bg-center overflow-hidden" style={{ backgroundImage: 'url(/images/result_bg.png)' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#fdfbf7]/100"></div>
        
        <div className="relative z-10 p-12 max-w-5xl mx-auto h-full flex flex-col justify-center">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            {name} 님의<br />TCI 검사 결과
          </motion.h1>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-xl text-purple-700 italic font-serif mb-6"
          >
            사람과 의미를 중요하게 여기는<br />감정 분석형 관계 구조
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-gray-600 max-w-md font-light mb-8"
          >
            따뜻한 공감과 높은 연대감으로 사람을 이해하고, 관계의 의미를 깊이 생각하는 섬세한 성향입니다.
          </motion.p>
          
          <div className="flex gap-3 text-sm">
            <span className="bg-white/80 backdrop-blur px-4 py-1.5 rounded-full text-gray-600 shadow-sm">👤 {gender}</span>
            {age && <span className="bg-white/80 backdrop-blur px-4 py-1.5 rounded-full text-gray-600 shadow-sm">👤 {age}세</span>}
            <span className="bg-white/80 backdrop-blur px-4 py-1.5 rounded-full text-gray-600 shadow-sm">📅 {new Date().toLocaleDateString('ko-KR')}</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 -mt-8 relative z-20">
        
        {/* Top 4 Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {top4.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }} 
              className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: item.color }}>
                  <Heart className="w-3 h-3" />
                </div>
                <span className="font-semibold text-gray-700 text-sm">{item.name} ({item.key})</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{item.avg}</div>
              <div className="text-sm font-medium text-purple-600 mb-2">높은 편</div>
              <p className="text-xs text-gray-500 leading-relaxed">
                사람들과의 연결을 중요하게 여깁니다.
              </p>
            </motion.div>
          ))}
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} 
            className="bg-purple-50 p-5 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-purple-100 transition-colors"
          >
            <span className="text-purple-700 font-medium text-sm flex items-center gap-2">
              전체 점수 보기 <ArrowRight className="w-4 h-4" />
            </span>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Bar Chart Area */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6">7가지 기질·성격 요약</h3>
            <div className="flex justify-end text-xs text-gray-400 mb-4 gap-6 pr-4">
              <span>원점수</span>
              <span>평균(1-4)</span>
            </div>
            <div className="flex flex-col gap-4">
              {data.map((item) => (
                <div key={item.key} className="flex items-center gap-4">
                  <div className="w-10 py-1 text-center rounded text-[10px] font-bold text-white" style={{ backgroundColor: item.color }}>
                    {item.key}
                  </div>
                  <div className="w-20 text-sm text-gray-700">{item.name}</div>
                  <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(item.avgNum / 4) * 100}%`, backgroundColor: item.color }} />
                  </div>
                  <div className="w-12 text-right text-sm text-gray-600">{item.score}</div>
                  <div className="w-12 text-right text-sm font-medium text-gray-800">{item.avg}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Radar Chart Area */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-2">기질·성격 프로파일</h3>
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data.map(d => ({ subject: d.key, A: d.avgNum, name: d.name }))}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#4b5563', fontSize: 11 }} />
                  <Radar name="Score" dataKey="A" stroke="#a855f7" fill="#d8b4e2" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div className="mb-12">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex justify-between items-center">
            심층 해석 하이라이트
            <span className="text-sm font-medium text-purple-600 cursor-pointer">전체 보기 →</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <Heart className="text-pink-500 mb-3 w-5 h-5" />
              <h4 className="font-bold text-gray-800 mb-2">관계 스타일</h4>
              <p className="text-sm text-gray-600 leading-relaxed">사람의 감정과 성향을 세심하게 이해하며, 신뢰를 기반으로 한 관계를 선호해요.</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <Activity className="text-green-500 mb-3 w-5 h-5" />
              <h4 className="font-bold text-gray-800 mb-2">감정 패턴</h4>
              <p className="text-sm text-gray-600 leading-relaxed">상대의 반응을 깊이 분석하고 오래 되돌아보는 경향이 있어요.</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <Shield className="text-blue-500 mb-3 w-5 h-5" />
              <h4 className="font-bold text-gray-800 mb-2">스트레스 반응</h4>
              <p className="text-sm text-gray-600 leading-relaxed">불확실한 상황에서 불안이 높아질 수 있고 혼자 정리하는 시간이 필요해요.</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <Sparkles className="text-purple-500 mb-3 w-5 h-5" />
              <h4 className="font-bold text-gray-800 mb-2">성장 제안</h4>
              <p className="text-sm text-gray-600 leading-relaxed">자기 감정을 더 존중하고 표현하는 연습이 균형에 도움이 돼요.</p>
            </div>
          </div>
        </div>

        {/* Detailed Report Text */}
        <div className="bg-white p-10 md:p-14 rounded-2xl shadow-sm border border-gray-100 text-gray-800 prose prose-purple max-w-none">
          <h1 className="text-2xl font-bold border-b pb-4 mb-8 text-center text-purple-900">
            {name} 님의 TCI 기반 심층 결과 분석
          </h1>

          <h2 className="text-xl font-bold text-purple-800 mt-10 mb-4">1. 전체 요약</h2>
          <p className="leading-loose">
            {name}님의 전체 구조에서 가장 먼저 눈에 들어오는 핵심은, “강한 자기통제와 책임감 위에 신중함이 얹혀 있는 안정 추구형 구조”라는 점입니다. 특히 P 인내력, SD 자율성, C 연대감이 모두 높게 형성되어 있어, 단순히 성실한 수준을 넘어 스스로의 역할과 책임을 매우 중요하게 받아들이는 흐름이 강하게 나타납니다.
          </p>
          <p className="leading-loose mt-4">
            반면 NS 자극추구가 낮다는 점은 이 구조를 더욱 특징적으로 만듭니다. 새로운 자극이나 급격한 변화보다는 익숙함, 안정감, 예측 가능한 흐름 안에서 에너지를 유지하려는 경향이 매우 강할 가능성이 큽니다. 즉 “재미보다 안정”, “충동보다 책임”, “새로움보다 유지”에 가까운 심리 구조로 해석될 수 있습니다.
          </p>
          <p className="leading-loose mt-4">
            전체적으로 {name}님은 감정이나 순간적 충동보다, “삶을 안정적으로 유지하는 것”에 훨씬 더 무게를 두는 타입에 가깝습니다. 누군가에게 쉽게 휘둘리기보다 스스로 기준을 세우고, 관계와 책임을 오래 유지하려는 방향성이 매우 강한 구조로 보입니다.
          </p>

          <h2 className="text-xl font-bold text-purple-800 mt-10 mb-4">2. 핵심 기질 구조</h2>
          <p className="leading-loose">
            {name}님의 가장 특징적인 부분은 낮은 NS 자극추구입니다. 이 점수는 단순히 “조용하다” 수준이 아니라, 삶 전체에서 변화와 불확실성을 상당히 피로하게 느낄 가능성을 의미합니다.
          </p>
          <ul className="list-disc pl-6 leading-loose mt-4 text-gray-700 bg-purple-50/50 p-6 rounded-xl">
            <li>갑작스러운 변화보다 익숙한 흐름을 선호하고</li>
            <li>감정 기복이 큰 환경에서 쉽게 피로를 느끼며</li>
            <li>삶을 안정적으로 유지하려는 욕구가 강하고</li>
            <li>위험 부담이 큰 선택을 오래 고민하는 경향이 있습니다.</li>
          </ul>

          <h2 className="text-xl font-bold text-purple-800 mt-10 mb-4">3. 성격 구조와 자기조절</h2>
          <p className="leading-loose">
            {name}님의 핵심 강점은 높은 SD 자율성과 C 연대감입니다. 자기 기준과 자기통제력이 매우 강한 구조를 의미합니다. 감정이 흔들리더라도 삶 전체가 쉽게 무너지기보다, 스스로 방향을 유지하려는 힘이 상당히 강할 가능성이 있습니다.
          </p>
          <p className="leading-loose mt-4">
            동시에 C 연대감 역시 높습니다. 이는 사람을 대할 때 기본적인 배려와 책임감을 매우 중요하게 여긴다는 의미입니다. 다만 이 조합은 “남을 잘 챙기지만 자기 감정은 뒤로 미루는 패턴”으로 이어질 가능성도 있습니다.
          </p>

          <h2 className="text-xl font-bold text-purple-800 mt-10 mb-4">4. 감정과 스트레스 반응</h2>
          <p className="leading-loose">
            감정이 올라왔을 때 즉각적으로 표현하기보다, 먼저 스스로 통제하고 정리하려는 흐름이 매우 강할 가능성이 있습니다.
            감정 피로가 누적될 경우 말수가 줄어들고, 혼자 정리하려는 시간이 길어지며, 관계 에너지를 줄이기 시작할 수 있습니다. 겉으로는 굉장히 안정적으로 보이지만 실제로는 혼자 오래 긴장하고 있을 가능성이 있습니다.
          </p>

          <h2 className="text-xl font-bold text-purple-800 mt-10 mb-4">5. 인간관계 패턴</h2>
          <p className="leading-loose">
            인간관계에서 자극적이고 불안정한 흐름보다, 신뢰와 안정감을 훨씬 중요하게 느낄 가능성이 큽니다. 감정 기복이 심하지 않고 말과 행동 차이가 적은 사람에게 편안함을 느낍니다. 반대로 감정 온도가 자주 바뀌거나 예측 불가능한 태도를 보이는 사람에게는 빠르게 피로를 느낄 수 있습니다.
          </p>

          <h2 className="text-xl font-bold text-purple-800 mt-10 mb-4">6. 사고방식과 자기방어</h2>
          <p className="leading-loose">
            사고 흐름은 매우 현실적이고 안정 지향적인 편입니다. 자기방어 방식은 자기통제, 감정 억제, 혼자 정리하기, 관계 유지 중심 사고 방향으로 나타날 가능성이 큽니다. 갈등 상황에서도 바로 감정을 폭발시키기보다 상황을 조용히 정리하려 합니다.
          </p>

          <h2 className="text-xl font-bold text-purple-800 mt-10 mb-4">7. 장점과 잠재적 취약점</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="bg-green-50 p-6 rounded-xl">
              <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4"/> 장점</h4>
              <ul className="list-disc pl-5 text-sm leading-relaxed text-green-900">
                <li>매우 높은 책임감</li>
                <li>꾸준함과 지속력</li>
                <li>안정적인 관계 유지 능력</li>
                <li>현실적인 판단력</li>
                <li>높은 자기통제력</li>
              </ul>
            </div>
            <div className="bg-red-50 p-6 rounded-xl">
              <h4 className="font-bold text-red-800 mb-3 flex items-center gap-2"><Shield className="w-4 h-4"/> 잠재적 취약점</h4>
              <ul className="list-disc pl-5 text-sm leading-relaxed text-red-900">
                <li>감정을 오래 누적할 가능성</li>
                <li>자기 피로를 늦게 인식할 가능성</li>
                <li>변화 자체를 지나치게 부담스럽게 느낌</li>
                <li>스트레스를 혼자 감당하려는 경향</li>
              </ul>
            </div>
          </div>

          <h2 className="text-xl font-bold text-purple-800 mt-10 mb-4">8. 종합 결론</h2>
          <div className="bg-gradient-to-r from-purple-100 to-indigo-50 p-8 rounded-2xl border border-purple-200 text-center">
            <p className="text-lg font-medium text-purple-900 leading-relaxed">
              “강한 책임감과 자기통제를 바탕으로, 안정과 신뢰를 유지하려는 현실형 구조”
            </p>
            <p className="mt-4 text-purple-800 text-sm leading-loose">
              {name}님은 감정보다 책임과 안정감을 중요하게 여기고, 스스로 삶의 균형을 유지하려 노력하는 분입니다. 겉으로는 차분해 보이지만 내면의 긴장을 조절하는 스스로의 힘을 가끔은 온전히 내려놓고 쉬어가는 시간이 필요합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const ArrowRight = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
)
