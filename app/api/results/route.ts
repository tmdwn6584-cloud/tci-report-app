import { NextResponse } from "next/server";

// Vercel 환경에서는 localStorage 대신 메모리 기반 저장소 사용
let memoryStorage: any[] = [];

const parseRequestBody = async (req: Request) => {
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return await req.json();
  }

  const text = await req.text();
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
};

export async function GET() {
  // Vercel에서는 메모리 저장소에서 데이터 반환
  return new Response(JSON.stringify(memoryStorage), { headers: { "Content-Type": "application/json" } });
}

export async function POST(req: Request) {
  const payload = await parseRequestBody(req);
  const sessionId = payload.sessionId || payload.id;
  if (!sessionId) {
    return new Response(JSON.stringify({ success: false, error: "sessionId is required" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  const name = payload.name || "사용자";
  const gender = payload.gender || "";
  const age = payload.age || "";
  const mode = payload.mode === "lite" ? "lite" : "full";
  const status = payload.status === "completed" ? "completed" : "incomplete";
  const startedAt = payload.startedAt || new Date().toISOString();
  const finishedAt = status === "completed" ? (payload.finishedAt || new Date().toISOString()) : null;
  const currentQuestionIndex = typeof payload.currentQuestionIndex === "number" ? payload.currentQuestionIndex : 0;
  const answersString = typeof payload.answersString === "string" ? payload.answersString : "";
  const questionTimes = JSON.stringify(Array.isArray(payload.questionTimes) ? payload.questionTimes : []);
  const totalAnswered = answersString.split("").filter((value: string) => value !== "0" && value !== "").length;
  const now = new Date().toISOString();

  const sessionData = {
    id: sessionId,
    name,
    gender,
    age,
    mode,
    status,
    startedAt,
    finishedAt,
    currentQuestionIndex,
    totalAnswered,
    answersString,
    questionTimes,
    createdAt: now,
    updatedAt: now,
  };

  // 메모리 저장소에서 기존 세션 찾기
  const existingIndex = memoryStorage.findIndex(item => item.id === sessionId);
  if (existingIndex >= 0) {
    memoryStorage[existingIndex] = sessionData;
  } else {
    memoryStorage.push(sessionData);
  }

  return new Response(JSON.stringify({ success: true, id: sessionId }), { headers: { "Content-Type": "application/json" } });
}
