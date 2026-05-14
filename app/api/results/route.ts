import { NextResponse } from "next/server";
import { getAllResults, saveResultRecord } from "@/lib/results";

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
  try {
    const results = await getAllResults();
    return NextResponse.json(results);
  } catch (error) {
    console.error("GET /api/results error:", error);
    return new Response(JSON.stringify({ success: false, error: "Internal server error" }), {
      headers: { "Content-Type": "application/json" },
      status: 500
    });
  }
}

export async function POST(req: Request) {
  try {
    const payload = await parseRequestBody(req);
    const sessionId = payload.sessionId || payload.id;
    if (!sessionId) {
      return new Response(JSON.stringify({ success: false, error: "sessionId is required" }), {
        headers: { "Content-Type": "application/json" },
        status: 400
      });
    }

    const name = payload.name || "»ç¿ëÀÚ";
    const gender = payload.gender || "";
    const age = payload.age || "";
    const mode = payload.mode === "lite" ? "lite" : "full";
    const status = payload.status === "completed" ? "completed" : "incomplete";
    const startedAt = payload.startedAt || new Date().toISOString();
    const finishedAt = status === "completed" ? (payload.finishedAt || new Date().toISOString()) : null;
    const currentQuestionIndex = typeof payload.currentQuestionIndex === "number" ? payload.currentQuestionIndex : 0;
    const answersString = typeof payload.answersString === "string" ? payload.answersString : "";
    const questionTimes = Array.isArray(payload.questionTimes) ? payload.questionTimes : [];
    const totalAnswered = answersString.split("").filter((value: string) => value !== "0" && value !== "").length;
    const result = await saveResultRecord({
      type: status === "completed" ? "complete" : "progress",
      sessionId,
      name,
      gender,
      age,
      mode,
      status,
      startedAt,
      finishedAt,
      currentQuestionIndex,
      answersString,
      questionTimes,
      totalAnswered,
      resultId: payload.resultId,
    });

    return NextResponse.json({ success: true, resultId: result.id });
  } catch (error) {
    console.error("POST /api/results error:", error);
    return new Response(JSON.stringify({ success: false, error: "Internal server error" }), {
      headers: { "Content-Type": "application/json" },
      status: 500
    });
  }
}
