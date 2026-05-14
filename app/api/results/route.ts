import db from "@/lib/db";

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
  const rows = db.prepare("SELECT * FROM sessions ORDER BY createdAt DESC").all();
  return new Response(JSON.stringify(rows), { headers: { "Content-Type": "application/json" } });
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

  db.prepare(`
    INSERT INTO sessions (
      id, name, gender, age, mode, status, startedAt, finishedAt,
      currentQuestionIndex, totalAnswered, answersString, questionTimes,
      createdAt, updatedAt
    ) VALUES (
      @id, @name, @gender, @age, @mode, @status, @startedAt, @finishedAt,
      @currentQuestionIndex, @totalAnswered, @answersString, @questionTimes,
      @createdAt, @updatedAt
    )
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      gender = excluded.gender,
      age = excluded.age,
      mode = excluded.mode,
      status = excluded.status,
      startedAt = excluded.startedAt,
      finishedAt = excluded.finishedAt,
      currentQuestionIndex = excluded.currentQuestionIndex,
      totalAnswered = excluded.totalAnswered,
      answersString = excluded.answersString,
      questionTimes = excluded.questionTimes,
      updatedAt = excluded.updatedAt
  `).run({
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
  });

  return new Response(JSON.stringify({ success: true, id: sessionId }), { headers: { "Content-Type": "application/json" } });
}
