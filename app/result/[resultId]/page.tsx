import { Suspense } from "react";
import { notFound } from "next/navigation";
import ResultContent, { ResultData } from "@/components/ResultContent";
import { getResultById } from "@/lib/results";

interface ResultPageProps {
  params: {
    resultId: string;
  };
}

export default async function ResultByIdPage({ params }: ResultPageProps) {
  const result = await getResultById(params.resultId);
  if (!result || result.status !== "completed") {
    notFound();
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fdfbf7]" />}>
      <ResultContent initialResultData={result as ResultData} />
    </Suspense>
  );
}
