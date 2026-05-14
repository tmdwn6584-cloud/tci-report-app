"use client";

import { Suspense } from "react";
import ResultContent from "@/components/ResultContent";

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fdfbf7]" />}>
      <ResultContent />
    </Suspense>
  );
}
