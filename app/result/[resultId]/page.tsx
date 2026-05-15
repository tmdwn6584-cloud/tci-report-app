"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ResultContent from "@/components/ResultContent";

interface ResultRecord {
  id: string;
  name: string;
  gender: string;
  age: string;
  mode: "full" | "lite";
  answers_string: string;
  created_at: string;
}

export default function ResultDetailPage() {
  const params = useParams();
  const resultId = params.resultId as string;
  const [result, setResult] = useState<ResultRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      if (!resultId) {
        setError("Result ID is missing");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/results?id=${encodeURIComponent(resultId)}`);
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        
        if (!data || !data.id) {
          setError("Result not found");
          setResult(null);
        } else {
          setResult(data);
          setError(null);
        }
      } catch (err) {
        console.error("Failed to fetch result:", err);
        setError("Failed to load result. Please try again.");
        setResult(null);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [resultId]);

  if (loading) {
    return <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center">Loading...</div>;
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-3xl shadow-lg max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-3">Result Not Found</h1>
          <p className="text-gray-600 mb-6">{error || "The result could not be found."}</p>
          <a href="/" className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-medium transition-colors">
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  const resultData = {
    id: result.id,
    sessionId: result.id,
    name: result.name,
    gender: result.gender,
    age: result.age,
    mode: result.mode,
    status: "completed" as const,
    startedAt: result.created_at,
    finishedAt: result.created_at,
    currentQuestionIndex: 0,
    totalAnswered: 0,
    answersString: result.answers_string,
    questionTimes: [],
    createdAt: result.created_at,
    updatedAt: result.created_at
  };

  return <ResultContent initialResultData={resultData} />;
}
