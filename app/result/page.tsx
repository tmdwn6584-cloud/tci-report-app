"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import Link from "next/link";
import Script from "next/script";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { questions } from "@/data/questions";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { Heart, Shield, Sparkles, Activity, Lock, Share2, Download as DownloadIcon } from "lucide-react";
import * as htmlToImage from "html-to-image";

const dimensionMap = {
  NS: "자극추구", HA: "위험회피", RD: "사회적 민감성", P: "인내력",
  SD: "자율성", C: "연대감", ST: "자기초월"
};

const dimensionColors = {
  NS: "#60a5fa", HA: "#fb923c", RD: "#f472b6", P: "#4ade80",
  SD: "#2dd4bf", C: "#c084fc", ST: "#a78bfa"
};

type DimensionKey = keyof typeof dimensionMap;

const calculateScores = (targetQuestions: { dimension: DimensionKey; reverse?: boolean; }[], answers: number[]) => {
  const scores: Record<DimensionKey, number> = { NS: 0, HA: 0, RD: 0, P: 0, SD: 0, C: 0, ST: 0 };
  const counts: Record<DimensionKey, number> = { NS: 0, HA: 0, RD: 0, P: 0, SD: 0, C: 0, ST: 0 };

  targetQuestions.forEach((q, idx) => {
    if (answers[idx] === undefined) return;
    let val = answers[idx];
    if (q.reverse) val = 5 - val;
    const key = q.dimension as DimensionKey;
    scores[key] += val;
    counts[key] += 1;
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
  const [modal, setModal] = useState<{ isOpen: boolean, message: string, isError: boolean }>({ isOpen: false, message: "", isError: false });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [kakaoReady, setKakaoReady] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const photocardRef = useRef<HTMLDivElement>(null);

  const showModal = (message: string, isError = false) => {
    setModal({ isOpen: true, message, isError });
    setTimeout(() => setModal(prev => ({ ...prev, isOpen: false })), 4000);
  };

  const initializeKakao = () => {
    if (typeof window === "undefined") return;
    const kakao = (window as any).Kakao;
    console.log("[Kakao Debug] Current browser URL:", window.location.href);
    if (kakao) {
      console.log("[Kakao Debug] Kakao object detected:", kakao);
      console.log("[Kakao Debug] isInitialized before init:", kakao.isInitialized?.());
      if (!kakao.isInitialized()) kakao.init('eb6ebbac5f7b9fbffaab1831e460c4bf');
      console.log("[Kakao Debug] isInitialized after init:", kakao.isInitialized?.());
      setKakaoReady(true);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const kakao = (window as any).Kakao;
    if (kakao) {
      if (!kakao.isInitialized()) kakao.init('eb6ebbac5f7b9fbffaab1831e460c4bf');
      setKakaoReady(true);
    }
  }, []);

  const handleShareKakao = async () => {
    if (typeof window === "undefined") return;

    const kakao = (window as any).Kakao;
    console.log("[Kakao Debug] currentUrl in share handler:", window.location.href);
    console.log("[Kakao Debug] kakao.isInitialized():", kakao?.isInitialized?.());
    if (!kakao || !kakao.isInitialized()) {
      showModal("카카오톡 공유 기능을 초기화 중입니다. 잠시만 기다려주세요.", true);
      return;
    }

    const queryString = searchParams.toString();
    const currentPath = window.location.pathname;
    const shareUrl = currentPath.includes("/result")
      ? `${window.location.origin}${currentPath}${queryString ? `?${queryString}` : ""}`
      : `${window.location.origin}/result?${queryString}`;
    console.log("[Kakao Debug] shareUrl:", shareUrl);
    const imageUrl = `${window.location.origin}/og-image.png`;
    const shareTitle = "TCI 감정의 좌표";
    const shareDesc = `${name}님의 감정 흐름을 우아하게 읽어드립니다. 지금 결과를 확인해보세요.`;

    try {
      kakao.Link.sendDefault({
        objectType: "feed",
        content: {
          title: shareTitle,
          description: shareDesc,
          imageUrl,
          imageWidth: 1200,
          imageHeight: 630,
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl
          }
        },
        buttons: [
          {
            title: "결과 보기",
            link: {
              mobileWebUrl: shareUrl,
              webUrl: shareUrl
            }
          }
        ]
      });
      showModal("카카오톡 공유창이 열렸습니다.", false);
    } catch (err: any) {
      console.error("Kakao share failed", err);
      const message = err?.message?.includes("4019")
        ? "카카오 앱 설정에서 도메인을 등록해야 합니다. 앱 관리 페이지에서 JavaScript 키와 도메인을 확인해주세요."
        : "카카오톡 공유에 실패했습니다. 다시 시도해주세요.";
      showModal(message, true);
    }
  };

  const handleDownloadImage = async () => {
    if (!resultRef.current) return;
    try {
      showModal("리포트 화면을 저장 중입니다...", false);
      const dataUrl = await htmlToImage.toPng(resultRef.current, { pixelRatio: 2, backgroundColor: '#fdfbf7' });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${name}_전체분석리포트.png`;
      link.click();
      showModal("전체 리포트가 성공적으로 저장되었습니다!", false);
    } catch (err) {
      console.error('Image capture failed', err);
      showModal("이미지 저장에 실패했습니다.", true);
    }
  };

  const mode = searchParams.get("mode") === "lite" ? "lite" : "full";
  const fullTestParams = new URLSearchParams({
    n: name,
    g: gender,
    age,
    mode: 'full'
  }).toString();

  useEffect(() => {
    const a = searchParams.get("a");
    if (a) {
      const answers = a.split("").map(Number);
      const targetQuestions = mode === "lite" ? questions.slice(0, 20) : questions;
      const processed = calculateScores(targetQuestions, answers);
      setData(processed);

      // Save to localStorage
      const history = JSON.parse(localStorage.getItem("tci_history") || "[]");
      const newEntry = {
        id: Date.now(), name, gender, age, mode,
        date: new Date().toLocaleDateString('ko-KR'),
        answersString: a, data: processed
      };
      localStorage.setItem("tci_history", JSON.stringify([newEntry, ...history]));
    }
  }, [searchParams, name, gender, age, mode]);

  if (data.length === 0) return <div className="min-h-screen bg-[#fdfbf7]" />;

  const top4 = [...data].sort((a, b) => b.avgNum - a.avgNum).slice(0, 4);

  return (
    <div className="pb-24 bg-[#fdfbf7] min-h-screen font-sans w-full max-w-[100vw] overflow-x-hidden">
      <div ref={resultRef} className="w-full max-w-full">
        {/* Hero Section */}
        <div className="relative w-full h-[400px] md:h-[450px] overflow-hidden bg-white">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom right, rgba(243, 232, 255, 0.4), rgba(239, 246, 255, 0.3), rgba(253, 242, 248, 0.2))' }}></div>
        <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-200/30 rounded-full blur-[80px] md:blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-blue-200/30 rounded-full blur-[80px] md:blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>
        
        <Script src="https://developers.kakao.com/sdk/js/kakao.min.js" strategy="afterInteractive" onLoad={initializeKakao} />
      <div className="relative z-10 p-6 md:p-16 max-w-5xl mx-auto h-full flex flex-col justify-center items-center text-center">
          <div className="inline-block px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-white/60 backdrop-blur border border-white/50 text-purple-600 text-[10px] md:text-xs font-semibold tracking-wider mb-4 md:mb-6 shadow-sm">
            EMOTIONAL INSIGHT REPORT
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-5xl font-light text-gray-800 mb-4 md:mb-6 tracking-tight leading-snug md:leading-tight break-keep"
          >
            <span className="font-semibold text-purple-700">{name}</span> 님의<br/>
            감정 흐름 분석 결과
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-sm md:text-xl text-gray-500 font-light max-w-2xl leading-relaxed mb-6 md:mb-8 break-keep px-4"
          >
            "가까워질수록 감정의 의미를 깊게 받아들이며,<br className="hidden md:block"/>
            관계의 미세한 거리감 변화에 예민하게 반응할 가능성이 있습니다."
          </motion.p>
          
          <div className="flex gap-2 md:gap-4 text-xs md:text-sm">
            <span className="bg-white/50 backdrop-blur-md px-4 md:px-5 py-1.5 md:py-2 rounded-full text-gray-500 font-medium border border-white/40 shadow-sm">{gender}</span>
            {age && <span className="bg-white/50 backdrop-blur-md px-4 md:px-5 py-1.5 md:py-2 rounded-full text-gray-500 font-medium border border-white/40 shadow-sm">{age}세</span>}
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto px-4 md:px-6 -mt-8 md:-mt-12 relative z-20">
        
        {/* Free Section: Top Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
          {top4.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }} 
              className="bg-white/90 backdrop-blur-lg p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-white"
            >
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-xl flex items-center justify-center text-white shadow-sm" style={{ backgroundColor: item.color }}>
                  <Heart className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </div>
                <span className="font-semibold text-gray-700 text-xs md:text-sm">{item.name}</span>
              </div>
              <div className="text-2xl md:text-3xl font-light text-gray-800 mb-1">{item.avg}</div>
              <p className="text-[10px] md:text-xs text-gray-400 font-medium tracking-wide">핵심 영향 요인</p>
            </motion.div>
          ))}
        </div>

        {/* Free Section: Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-gray-50 flex flex-col items-center">
            <h3 className="text-base md:text-lg font-bold text-gray-800 mb-4 md:mb-6 self-start">감정·기질 프로파일</h3>
            <div className="w-full max-w-[320px] h-[250px] md:h-64 mx-auto">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data.map(d => ({ subject: d.key, A: d.avgNum, name: d.name }))}>
                  <PolarGrid stroke="#f3f4f6" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                  <Radar name="Score" dataKey="A" stroke="#a855f7" fill="#e9d5ff" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-gray-50">
            <h3 className="text-base md:text-lg font-bold text-gray-800 mb-4 md:mb-6">세부 지표</h3>
            <div className="flex flex-col gap-4 md:gap-5">
              {data.map((item) => (
                <div key={item.key} className="flex items-center gap-3 md:gap-4">
                  <div className="w-8 md:w-10 text-[10px] md:text-xs font-bold text-gray-400">{item.key}</div>
                  <div className="w-16 md:w-20 text-xs md:text-sm text-gray-600 font-medium break-keep">{item.name}</div>
                  <div className="flex-1 bg-gray-50 h-2 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(item.avgNum / 4) * 100}%`, backgroundColor: item.color }} />
                  </div>
                  <div className="w-8 text-right text-xs md:text-sm font-medium text-gray-800">{item.avg}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Free Section: Short Conclusion */}
        <div className="flex flex-col gap-6 w-full mb-12">
          <div className="text-center mb-6">
            <span className="text-purple-600 font-semibold tracking-widest text-xs md:text-sm mb-2 block">FREE ANALYSIS</span>
            <h2 className="text-xl md:text-2xl font-light text-gray-800 break-keep leading-snug">
              {name}님의 핵심 감정 패턴
            </h2>
          </div>

          <div className="bg-white/90 p-6 md:p-8 rounded-[1.5rem] shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-gray-100">
            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-purple-400 rounded-full"></span>
              인간관계 패턴
            </h3>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed font-light break-keep">
              당신은 관계 자체보다, 관계의 감정 흐름 변화에 더 크게 반응하는 경향이 있습니다.
              가까워질수록 상대 반응과 거리감 변화를 더 세밀하게 읽게 될 가능성이 있습니다.
            </p>
          </div>

          <div className="bg-white/90 p-6 md:p-8 rounded-[1.5rem] shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-gray-100">
            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-blue-400 rounded-full"></span>
              감정 흐름
            </h3>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed font-light break-keep">
              감정이 완전히 정리되지 않은 관계는, 이미 끝났더라도 머릿속에서 반복 복기될 가능성이 있습니다.
              특히 애매했던 관계일수록 감정이 오래 남는 흐름이 나타날 수 있습니다.
            </p>
          </div>

          <div className="bg-white/90 p-6 md:p-8 rounded-[1.5rem] shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-gray-100">
            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-green-400 rounded-full"></span>
              자기방어 방식
            </h3>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed font-light break-keep">
              겉으로는 비교적 차분해 보여도, 실제 내면에서는 감정을 오래 정리하고 있을 가능성이 있습니다.
              감정을 바로 터뜨리기보다 내부에서 오래 해석하는 흐름이 존재할 수 있습니다.
            </p>
          </div>

          <div className="bg-white/90 p-6 md:p-8 rounded-[1.5rem] shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-gray-100">
            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-pink-400 rounded-full"></span>
              감정 피로 구조
            </h3>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed font-light break-keep">
              감정 피로가 누적될 경우, 갑자기 관계 에너지를 줄이고 혼자만의 시간이 길어질 가능성이 있습니다.
              겉으로는 괜찮아 보여도 내부 피로는 이미 오래 쌓여 있을 수 있습니다.
            </p>
          </div>
        </div>

        {/* Premium Locked Section */}
        <div className="relative w-full">
          <div className="p-8 md:p-14 rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl text-white max-w-none w-full relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, #111827, #1f2937)' }}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px]"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px]"></div>
            
            <div className="relative z-10 text-center mb-10">
              <div className="inline-block p-3 bg-white/10 rounded-2xl mb-4 backdrop-blur-md">
                <Lock className="w-6 h-6 text-purple-300" />
              </div>
              <h2 className="text-2xl md:text-3xl font-light mb-4 break-keep">
                내 감정의 깊은 곳을 읽는<br />
                <span className="font-semibold text-purple-300">프리미엄 심층 리포트</span>
              </h2>
              <p className="text-gray-400 text-sm md:text-base font-light break-keep">
                15~20페이지 분량의 심층 분석으로 나의 관계 패턴을 완벽히 이해하세요.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              {[
                "왜 특정 관계를 오래 못 놓는가",
                "감정 과부하 구조",
                "관계 거리감 민감도 상세",
                "자기방어 패턴 심층",
                "관계 과몰입 가능성",
                "감정 복기 메커니즘",
                "반복되는 인간관계 흐름",
                "감정 회피 및 통제 방식",
                "스트레스 반응 심층"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <span className="text-sm md:text-base text-gray-200 font-light">{item}</span>
                  <Lock className="w-4 h-4 text-purple-400/70" />
                </div>
              ))}
            </div>

            <div className="text-center">
              <button className="w-full md:w-auto px-8 py-5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-medium shadow-[0_8px_30px_rgba(147,51,234,0.3)] transition-all flex items-center justify-center gap-2 mx-auto">
                <Sparkles className="w-5 h-5 text-purple-100" />
                <span>프리미엄 리포트 열람하기</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {mode === 'lite' && (
        <div className="mt-8 md:mt-12 text-center px-4 md:px-0 w-full max-w-4xl mx-auto">
          <Link href={`/test?${fullTestParams}`} className="inline-flex items-center justify-center mx-auto px-6 py-4 bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 rounded-2xl shadow-sm transition-all text-sm md:text-base font-medium">
            더 자세한 분석을 위해 180문항 정밀 검사 받기
          </Link>
        </div>
      )}

      {/* Share and Download Buttons */}
        <div className="mt-8 md:mt-12 flex flex-col md:flex-row gap-3 md:gap-4 justify-center px-4 md:px-0 w-full max-w-4xl mx-auto">
          <button 
            onClick={handleShareKakao}
            className="flex items-center justify-center gap-2 px-6 md:px-8 py-4 bg-[#FEE500] hover:bg-[#FDD800] text-[#3C1E1E] font-semibold rounded-2xl shadow-sm transition-all w-full md:w-auto text-sm md:text-base"
          >
            <Share2 className="w-4 h-4 md:w-5 md:h-5" />
            카카오톡 포토카드 공유하기
          </button>
          
          <button 
            onClick={handleDownloadImage}
            className="flex items-center justify-center gap-2 px-6 md:px-8 py-4 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold rounded-2xl shadow-sm transition-all w-full md:w-auto text-sm md:text-base"
          >
            <DownloadIcon className="w-4 h-4 md:w-5 md:h-5" />
            전체 리포트 화면 저장
          </button>
        </div>

        {/* Hidden Photo Card for Sharing */}
        <div className="fixed top-[-9999px] left-[-9999px] pointer-events-none">
          <div ref={photocardRef} className="w-[1080px] h-[1920px] flex flex-col items-center justify-between p-24 font-sans relative overflow-hidden" style={{ letterSpacing: '-0.02em', background: 'linear-gradient(to bottom right, #fdfbf7, #f3e8ff, #e0e7ff)' }}>
            {/* Background Decorative Blur */}
            <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-purple-300/40 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-blue-300/40 rounded-full blur-[120px]"></div>
            
            {/* Top Header */}
            <div className="flex flex-col items-center z-10 w-full mt-24">
              <div className="px-8 py-3 bg-white/70 backdrop-blur-md rounded-full text-purple-600 text-2xl font-bold tracking-widest mb-12 border border-white shadow-sm">
                PREMIUM EMOTIONAL INSIGHT
              </div>
              <h1 className="text-7xl font-light text-gray-800 text-center leading-tight">
                <span className="font-bold text-purple-600">{name}</span> 님의<br/>
                감정 흐름 프로필
              </h1>
              <div className="mt-12 flex gap-4">
                <span className="px-8 py-3 bg-white/80 rounded-full text-gray-500 text-3xl font-medium shadow-sm">{gender}</span>
                {age && <span className="px-8 py-3 bg-white/80 rounded-full text-gray-500 text-3xl font-medium shadow-sm">{age}세</span>}
              </div>
            </div>

            {/* Middle Content */}
            <div className="z-10 w-full px-12 flex flex-col gap-12 mt-16 flex-1 justify-center">
              <div className="bg-white/80 backdrop-blur-xl p-16 rounded-[4rem] shadow-2xl border border-white">
                <h2 className="text-4xl font-bold text-gray-800 mb-8 flex items-center gap-4">
                  <Heart className="w-12 h-12 text-purple-500" />
                  핵심 관계 패턴
                </h2>
                <p className="text-[2.5rem] text-gray-600 leading-normal font-light break-keep">
                  "당신은 관계 자체보다, 관계의 감정 흐름 변화에 더 크게 반응하는 경향이 있습니다. 
                  가까워질수록 상대 반응과 거리감 변화를 더 세밀하게 읽게 될 가능성이 있습니다."
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 mt-8">
                {top4.slice(0, 4).map((item, i) => (
                  <div key={i} className="bg-white/90 backdrop-blur-xl p-12 rounded-[3rem] shadow-xl border border-white flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-[2rem] flex items-center justify-center text-white mb-6 shadow-md" style={{ backgroundColor: item.color }}>
                      <Sparkles className="w-12 h-12" />
                    </div>
                    <span className="text-4xl font-bold text-gray-700 mb-4">{item.name}</span>
                    <span className="text-6xl font-light text-gray-800">{item.avg}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="z-10 w-full flex flex-col items-center mb-16 mt-16">
              <p className="text-4xl font-bold text-gray-800">TCI 감정의 좌표</p>
              <p className="text-3xl text-gray-500 mt-4 font-light">당신의 감정 흐름을 정성껏 읽어드립니다</p>
              <div className="mt-8 px-8 py-4 bg-gray-900 rounded-full">
                <p className="text-2xl text-white font-medium tracking-wide">tci-report-app.vercel.app</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Custom Modal / Toast */}
      <AnimatePresence>
        {modal.isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-10 left-0 right-0 z-[9999] flex justify-center px-4 pointer-events-none"
          >
            <div className="bg-white/95 backdrop-blur-xl px-6 md:px-8 py-5 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.12)] border border-gray-100 flex items-center gap-4 max-w-md w-full pointer-events-auto">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${modal.isError ? 'bg-red-50 text-red-500' : 'bg-purple-50 text-purple-600'}`}>
                {modal.isError ? <Activity className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
              </div>
              <p className="text-sm md:text-base text-gray-700 font-medium leading-relaxed break-keep">
                {modal.message}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Preview Modal Fallback */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4"
            onClick={() => setPreviewImage(null)}
          >
            <div className="absolute top-6 right-6 text-white text-sm bg-white/20 px-4 py-2 rounded-full backdrop-blur-md cursor-pointer border border-white/30">
              닫기 ✕
            </div>
            <div className="bg-white p-3 rounded-[2rem] shadow-2xl max-w-sm w-full flex flex-col relative" onClick={e => e.stopPropagation()}>
              <p className="text-center text-gray-800 font-semibold pt-2 pb-4 text-sm tracking-wide">
                👇 이미지를 꾹 눌러서 저장하거나 복사하세요!
              </p>
              <div className="overflow-hidden w-full rounded-2xl bg-gray-50 flex items-center justify-center" style={{ maxHeight: '70vh' }}>
                <img src={previewImage} alt="포토카드 미리보기" className="w-full h-full object-contain block" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
