"use client";

import { useEffect, useState } from "react";
import { questions } from "@/data/questions";
import { Download } from "lucide-react";

export default function AdminPage() {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("tci_history");
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const exportToCSV = () => {
    if (history.length === 0) return;

    // Build CSV header
    const headers = ["이름", "성별", "나이", "날짜", ...questions.map(q => q.id)];
    let csvContent = headers.join(",") + "\n";

    // Build rows
    history.forEach((row) => {
      const answers = row.answersString ? row.answersString.split("") : new Array(49).fill("");
      const rowData = [
        row.name,
        row.gender || "-",
        row.age || "-",
        row.date,
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

  return (
    <div className="p-10">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">관리자 페이지</h1>
          <p className="text-gray-500">모든 응답자의 데이터를 엑셀(CSV) 형식으로 조회하고 다운로드할 수 있습니다.</p>
        </div>
        <button 
          onClick={exportToCSV}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" />
          CSV 다운로드
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-bold">이름</th>
                <th className="px-6 py-4 font-bold">성별</th>
                <th className="px-6 py-4 font-bold">나이</th>
                <th className="px-6 py-4 font-bold">검사일자</th>
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
                  const answers = row.answersString ? row.answersString.split("") : new Array(49).fill("-");
                  return (
                    <tr key={idx} className="bg-white border-b border-gray-100 hover:bg-purple-50/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{row.name}</td>
                      <td className="px-6 py-4 text-gray-600">{row.gender || "-"}</td>
                      <td className="px-6 py-4 text-gray-600">{row.age || "-"}</td>
                      <td className="px-6 py-4 text-gray-500">{row.date}</td>
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
