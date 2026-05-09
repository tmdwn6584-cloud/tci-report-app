"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, ArrowRight, Trash2 } from "lucide-react";

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("tci_history");
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const clearHistory = () => {
    if (confirm("모든 기록을 삭제하시겠습니까?")) {
      localStorage.removeItem("tci_history");
      setHistory([]);
    }
  };

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">내 기록</h1>
          <p className="text-gray-500">이전에 진행했던 심층 분석 결과들을 다시 확인할 수 있습니다.</p>
        </div>
        {history.length > 0 && (
          <button 
            onClick={clearHistory}
            className="flex items-center text-sm text-red-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            기록 비우기
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-gray-100 shadow-sm text-center">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">아직 기록이 없습니다</h3>
          <p className="text-gray-500 mb-6">첫 번째 감정 흐름 분석을 시작해보세요.</p>
          <Link href="/">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
              검사하러 가기
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={item.id} 
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-purple-50 text-purple-700 text-xs font-bold px-3 py-1 rounded-full">
                  프리미엄 리포트
                </div>
                <div className="text-xs text-gray-400 font-medium">
                  {item.date}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name} 님</h3>
              <p className="text-sm text-gray-500 mb-6 flex-grow">
                주요 성향: {item.data.slice(0, 2).map((d: any) => d.name).join(", ")}
              </p>
              
              <div className="mt-auto">
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                  {item.data.map((d: any) => (
                    <div key={d.key} className="flex flex-col items-center min-w-[36px]">
                      <div className="w-full bg-gray-100 h-12 rounded-t flex items-end justify-center overflow-hidden">
                        <div 
                          className="w-full rounded-t" 
                          style={{ height: `${(d.avgNum / 4) * 100}%`, backgroundColor: d.color }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-500 mt-1">{d.key}</span>
                    </div>
                  ))}
                </div>
                
                <Link href={`/result?n=${encodeURIComponent(item.name)}&a=${item.answersString}`} className="block">
                  <button className="w-full py-2.5 bg-gray-50 hover:bg-purple-50 text-purple-600 text-sm font-medium rounded-xl transition-colors border border-transparent hover:border-purple-100 flex items-center justify-center gap-2">
                    결과 다시보기 <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
