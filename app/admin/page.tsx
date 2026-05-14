"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { questions } from "@/data/questions";
import { Download, Lock } from "lucide-react";

type ResultRecord = {
  id: string;
  name: string;
  gender: string;
  age: string;
  mode: string;
  status: string;
  date: string;
  finishedAt: string;
  createdAt: string;
  answersString: string;
};

const normalizeHistory = (raw: unknown): ResultRecord[] => {
  if (!Array.isArray(raw)) return [];

  return raw
    .filter((item): item is Record<string, unknown> => item !== null && typeof item === "object")
    .map((item) => ({
      id: typeof item.id === "string" ? item.id : String(Date.now()),
      name: typeof item.name === "string" ? item.name : "-",
      gender: typeof item.gender === "string" ? item.gender : "-",
      age: typeof item.age === "string" ? item.age : "-",
      mode: typeof item.mode === "string" ? item.mode : "-",
      status: typeof item.status === "string" ? item.status : "-",
      date: typeof item.date === "string" ? item.date : "",
      finishedAt: typeof item.finishedAt === "string" ? item.finishedAt : "",
      createdAt: typeof item.createdAt === "string" ? item.createdAt : "",
      answersString: typeof item.answersString === "string" ? item.answersString : "",
    }));
};

const parseAnswers = (value: unknown) => {
  if (Array.isArray(value)) return value.map((item) => String(item));
  if (typeof value === "string") return value.split("");
  return [];
};

const answerLabelMap: Record<string, string> = {
  "1": "전혀 아니다",
  "2": "아니다",
  "3": "그렇다",
  "4": "매우 그렇다",
};

const formatAnswerLabel = (value: string) => answerLabelMap[value] ?? value;

const downloadCSV = (history: ResultRecord[]) => {
  const headers = ["id", "name", "gender", "age", "mode", "status", "date", "detail"];
  let csv = headers.join(",") + "\n";

  history.forEach((item) => {
    const answers = parseAnswers(item.answersString).map((value, index) => {
      const question = questions[index]?.text || `Q${index + 1}`;
      return `${question} : ${formatAnswerLabel(value)}`;
    }).join(" | ");

    const row = [
      item.id,
      item.name,
      item.gender,
      item.age,
      item.mode,
      item.status,
      item.date || item.finishedAt || item.createdAt || "-",
      answers,
    ];
    csv += row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",") + "\n";
  });

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "admin_results.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [history, setHistory] = useState<ResultRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedRecord = history.find((item) => item.id === selectedId) ?? null;

  const detailedAnswers = selectedRecord
    ? parseAnswers(selectedRecord.answersString).map((value, index) => ({
        question: questions[index]?.text ?? `문항 ${index + 1}`,
        answer: formatAnswerLabel(value),
      }))
    : [];

  useEffect(() => {
    const loadHistory = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/results");
        if (!res.ok) throw new Error("Failed to load results");
        const json = await res.json();
        setHistory(normalizeHistory(json));
      } catch (err) {
        console.error(err);
        setError("데이터를 불러오는 중 문제가 발생했습니다.");
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password === "6448") {
      setIsAuthenticated(true);
      setPassword("");
      setError(null);
    } else {
      setError("비밀번호가 일치하지 않습니다.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSelectedId(null);
    setError(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="w-full max-w-sm bg-white shadow-lg rounded-3xl border border-gray-200 p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center">
              <Lock className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 text-center mb-3">관리자 로그인</h1>
          <p className="text-sm text-gray-500 text-center mb-6">관리자 비밀번호를 입력하면 데이터 페이지에 접근할 수 있습니다.</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="관리자 비밀번호"
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100 mb-4"
              autoFocus
            />
            {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
            <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-2xl hover:bg-purple-700 transition">로그인</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
            <p className="text-gray-600 mt-2">사용자 응답 데이터를 안전하게 확인하고 질문별 답변을 자세히 분석할 수 있습니다.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => downloadCSV(history)} className="px-5 py-3 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition">CSV 다운로드</button>
            <button onClick={handleLogout} className="px-5 py-3 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition">로그아웃</button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.5fr_0.8fr]">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">응답자 기록</h2>
            </div>
            <div className="p-4">
              {loading ? (
                <p className="text-gray-500">데이터를 불러오는 중입니다...</p>
              ) : error ? (
                <p className="text-red-600">{error}</p>
              ) : history.length === 0 ? (
                <p className="text-gray-500">저장된 결과가 없습니다.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm text-gray-700">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 font-semibold">ID</th>
                        <th className="px-4 py-3 font-semibold">이름</th>
                        <th className="px-4 py-3 font-semibold">모드</th>
                        <th className="px-4 py-3 font-semibold">상태</th>
                        <th className="px-4 py-3 font-semibold">일시</th>
                        <th className="px-4 py-3 font-semibold">상세</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((item) => (
                        <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                          <td className="px-4 py-3">{item.id}</td>
                          <td className="px-4 py-3">{item.name}</td>
                          <td className="px-4 py-3">{item.mode}</td>
                          <td className="px-4 py-3">{item.status}</td>
                          <td className="px-4 py-3">{item.date || item.finishedAt || item.createdAt || "-"}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => setSelectedId(item.id === selectedId ? null : item.id)}
                              className="px-3 py-2 bg-purple-600 text-white rounded-2xl hover:bg-purple-700 transition"
                            >
                              {item.id === selectedId ? "숨기기" : "보기"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">질문별 응답 상세</h2>
            </div>
            <div className="p-4">
              {selectedRecord ? (
                <>
                  <div className="mb-4 rounded-3xl border border-purple-100 bg-purple-50 p-4 text-sm text-purple-900">
                    <p className="font-semibold">{selectedRecord.name}님의 응답</p>
                    <p className="text-gray-600 mt-1">{selectedRecord.mode} / {selectedRecord.status}</p>
                  </div>
                  <div className="space-y-3">
                    {detailedAnswers.map((item, index) => (
                      <div key={index} className="rounded-3xl border border-gray-100 bg-gray-50 p-4">
                        <p className="text-sm text-gray-500 mb-2">Q{index + 1}. {item.question}</p>
                        <p className="text-sm font-semibold text-gray-900">답변: {item.answer}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-gray-500">표에서 개별 응답자를 선택하면 질문별 답변이 여기에 표시됩니다.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
