"use client";

import { useEffect, useMemo, useState } from "react";
import { questions } from "@/data/questions";
import { Download, Lock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await fetch("/api/results");
        if (!res.ok) throw new Error("Failed to load results");
        const json = await res.json();
        setHistory(json);
      } catch (err) {
        console.error(err);
        const saved = localStorage.getItem("tci_history");
        if (saved) {
          try {
            setHistory(JSON.parse(saved));
          } catch (parseError) {
            console.warn("Invalid local tci_history data", parseError);
          }
        }
      }
    };

    loadHistory();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "6448") {
      setIsAuthenticated(true);
      setError(false);
      sessionStorage.setItem("isAdmin", "true");
      window.dispatchEvent(new Event("adminLoginStatusChanged"));
    } else {
      setError(true);
      setPassword("");
    }
  };

  const exportToCSV = () => {
    if (history.length === 0) return;

    // Build CSV header
    const headers = ["이름", "성별", "나이", "모드", "상태", "일시", ...questions.map(q => q.id)];
    let csvContent = headers.join(",") + "\n";

    // Build rows
    history.forEach((row) => {
      const answers = row.answersString ? row.answersString.split("") : [];
      while (answers.length < questions.length) answers.push("");
      const rowData = [
        row.name,
        row.gender || "-",
        row.age || "-",
        row.mode || "-",
        row.status || "-",
        row.date || row.finishedAt || row.createdAt || "-",
        ...answers
      ];
      csvContent += rowData.join(",") + "\n";
    });

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "tci_results.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">관리자 로그인</h2>
          <p className="text-gray-500 text-sm mb-8">데이터 접근을 위해 비밀번호를 입력해주세요.</p>
          
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호" 
              className={`w-full px-4 py-3 rounded-xl border ${error ? 'border-red-400 bg-red-50' : 'border-gray-200'} focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all mb-4 text-center tracking-widest text-lg`}
              autoFocus
            />
            {error && <p className="text-red-500 text-sm mb-4">비밀번호가 일치하지 않습니다.</p>}
            <button 
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-xl shadow-sm transition-colors"
            >
              접속하기
            </button>
          </form>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("isAdmin");
    window.dispatchEvent(new Event("adminLoginStatusChanged"));
  };

  const completedResults = history.filter((item) => item.status === "completed");

  const averageTimeData = useMemo(() => {
    const averages = questions.map((question, index) => {
      const values = completedResults
        .map((item) => {
          try {
            const times = JSON.parse(item.questionTimes || "[]");
            return typeof times[index] === "number" ? times[index] : null;
          } catch {
            return null;
          }
        })
        .filter((time): time is number => typeof time === "number" && time > 0);

      const avg = values.length > 0 ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
      return {
        question: question.id.toUpperCase(),
        avgTime: Number(avg.toFixed(2)),
        text: question.text,
      };
    });

    return averages.sort((a, b) => b.avgTime - a.avgTime).slice(0, 12);
  }, [completedResults]);

  const dropoffData = useMemo(() => {
    const counts: Record<string, number> = {};

    history.forEach((item) => {
      if (item.status === "completed") return;
      const index = typeof item.currentQuestionIndex === "number"
        ? item.currentQuestionIndex
        : Math.max(0, (item.answersString || "").replace(/0/g, "").length - 1);
      const question = questions[index]?.id?.toUpperCase() || "START";
      counts[question] = (counts[question] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([question, value]) => ({ question, count: value }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12);
  }, [history]);

  return (
    <div className="p-10">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">관리자 페이지</h1>
          <p className="text-gray-500">모든 응답자의 데이터를 엑셀(CSV) 형식으로 조회하고 다운로드할 수 있습니다.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
          >
            <Lock className="w-4 h-4" />
            로그아웃
          </button>
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            CSV 다운로드
          </button>
        </div>
      </div>

      <div className="grid gap-6 mb-8 xl:grid-cols-[1fr_1fr]">
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">가장 오래 고민하는 문항</h2>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={averageTimeData} margin={{ top: 8, right: 16, left: -20, bottom: 12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="question" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value: number) => `${value}초`} />
              <Bar dataKey="avgTime" fill="#7c3aed" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">가장 많이 이탈하는 문항</h2>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={dropoffData} margin={{ top: 8, right: 16, left: -20, bottom: 12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="question" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value: number) => `${value}명`} />
              <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-bold">이름</th>
                <th className="px-6 py-4 font-bold">성별</th>
                <th className="px-6 py-4 font-bold">나이</th>
                <th className="px-6 py-4 font-bold">모드</th>
                <th className="px-6 py-4 font-bold">상태</th>
                <th className="px-6 py-4 font-bold">검사일시</th>
                {questions.map((q) => (
                  <th key={q.id} className="px-3 py-4 font-semibold text-gray-500" title={q.text}>
                    {q.id.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan={questions.length + 4} className="px-6 py-10 text-center text-gray-500">
                    저장된 데이터가 없습니다.
                  </td>
                </tr>
              ) : (
                history.map((row, idx) => {
                  const answers = row.answersString ? row.answersString.split("") : [];
                  while (answers.length < questions.length) answers.push("-");
                  return (
                    <tr key={idx} className="bg-white border-b border-gray-100 hover:bg-purple-50/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{row.name}</td>
                      <td className="px-6 py-4 text-gray-600">{row.gender || "-"}</td>
                      <td className="px-6 py-4 text-gray-600">{row.age || "-"}</td>
                      <td className="px-6 py-4 text-gray-600">{row.mode || "-"}</td>
                      <td className="px-6 py-4 text-gray-600">{row.status || "-"}</td>
                      <td className="px-6 py-4 text-gray-500">{row.date || row.finishedAt || row.createdAt || "-"}</td>
                      {answers.map((ans: string, i: number) => (
                        <td key={i} className="px-3 py-4 text-center">
                          <span className={`inline-block w-6 h-6 rounded-full text-xs font-bold leading-6 ${
                            ans === "4" ? "bg-purple-100 text-purple-700" :
                            ans === "3" ? "bg-blue-50 text-blue-600" :
                            ans === "2" ? "bg-gray-100 text-gray-600" :
                            "bg-orange-50 text-orange-500"
                          }`}>
                            {ans}
                          </span>
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-6 text-sm text-gray-500">
        * 표의 문항 ID(예: NS1, HA1)에 마우스를 올리면 전체 질문 내용을 확인할 수 있습니다.
      </div>
    </div>
  );
}
