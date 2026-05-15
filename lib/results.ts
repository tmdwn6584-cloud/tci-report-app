export type ResultStorageRecord = {
  id: string;
  sessionId: string;
  name: string;
  gender: string;
  age: string;
  mode: "full" | "lite";
  status: "completed" | "incomplete";
  startedAt: string;
  finishedAt: string | null;
  currentQuestionIndex: number;
  totalAnswered: number;
  answersString: string;
  questionTimes: number[];
  createdAt: string;
  updatedAt: string;
};

const env = ((globalThis as any).process?.env || {}) as Record<string, string | undefined>;
const SUPABASE_URL = env.SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_KEY || "";
const USE_SUPABASE = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);

const memoryStorage: Array<ResultStorageRecord> = [];

const supabaseHeaders = {
  Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
  apikey: SUPABASE_SERVICE_ROLE_KEY,
  Accept: "application/json",
  "Content-Type": "application/json",
  Prefer: "return=representation"
};

function parseSupabaseRecord(raw: any): ResultStorageRecord {
  return {
    id: raw.id,
    sessionId: raw.session_id,
    name: raw.name,
    gender: raw.gender,
    age: raw.age,
    mode: raw.mode,
    status: raw.status,
    startedAt: raw.started_at,
    finishedAt: raw.finished_at || null,
    currentQuestionIndex: raw.current_question_index,
    totalAnswered: raw.total_answered,
    answersString: raw.answers_string,
    questionTimes: Array.isArray(raw.question_times) ? raw.question_times : [],
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

export async function getAllResults(): Promise<ResultStorageRecord[]> {
  if (USE_SUPABASE) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/results?select=*`, {
      headers: supabaseHeaders,
    });
    if (!res.ok) {
      throw new Error(`Supabase GET all results failed: ${res.status}`);
    }
    const rawResults = await res.json();
    return rawResults.map(parseSupabaseRecord);
  }

  return memoryStorage;
}

export async function getResultById(resultId: string): Promise<ResultStorageRecord | null> {
  if (USE_SUPABASE) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/results?id=eq.${encodeURIComponent(resultId)}&select=*`, {
      headers: supabaseHeaders,
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`Supabase GET result failed: ${res.status}`);
    }
    const rawResults = await res.json();
    if (!Array.isArray(rawResults) || rawResults.length === 0) return null;
    return parseSupabaseRecord(rawResults[0]);
  }

  const record = memoryStorage.find((item) => item.id === resultId || item.sessionId === resultId);
  return record ?? null;
}

export type SaveResultPayload = {
  type: "progress" | "complete";
  sessionId: string;
  name: string;
  gender: string;
  age: string;
  mode: "full" | "lite";
  status: "completed" | "incomplete";
  startedAt: string;
  finishedAt: string | null;
  currentQuestionIndex: number;
  answersString: string;
  questionTimes: number[];
  totalAnswered: number;
  resultId?: string;
};

export async function saveResultRecord(payload: SaveResultPayload): Promise<ResultStorageRecord> {
  const resultId = payload.resultId || crypto.randomUUID();
  const now = new Date().toISOString();
  const record = {
    id: resultId,
    session_id: payload.sessionId,
    name: payload.name,
    gender: payload.gender,
    age: payload.age,
    mode: payload.mode,
    status: payload.status,
    started_at: payload.startedAt,
    finished_at: payload.finishedAt || null,
    current_question_index: payload.currentQuestionIndex,
    total_answered: payload.totalAnswered,
    answers_string: payload.answersString,
    question_times: payload.questionTimes,
    created_at: now,
    updated_at: now,
  };

  if (USE_SUPABASE) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/results?on_conflict=session_id&select=*`, {
      method: "POST",
      headers: supabaseHeaders,
      body: JSON.stringify(record),
    });

    if (!response.ok) {
      throw new Error(`Supabase save failed: ${response.status}`);
    }

    const rawResults = await response.json();
    if (!Array.isArray(rawResults) || rawResults.length === 0) {
      throw new Error("Supabase save returned empty result");
    }
    return parseSupabaseRecord(rawResults[0]);
  }

  const existingIndex = memoryStorage.findIndex((item) => item.sessionId === payload.sessionId);
  if (existingIndex >= 0) {
    memoryStorage[existingIndex] = {
      ...memoryStorage[existingIndex],
      ...record,
      sessionId: payload.sessionId,
      id: resultId,
      questionTimes: payload.questionTimes,
    } as ResultStorageRecord;
    return memoryStorage[existingIndex];
  }

  const newRecord: ResultStorageRecord = {
    id: resultId,
    sessionId: payload.sessionId,
    name: payload.name,
    gender: payload.gender,
    age: payload.age,
    mode: payload.mode,
    status: payload.status,
    startedAt: payload.startedAt,
    finishedAt: payload.finishedAt || null,
    currentQuestionIndex: payload.currentQuestionIndex,
    totalAnswered: payload.totalAnswered,
    answersString: payload.answersString,
    questionTimes: payload.questionTimes,
    createdAt: now,
    updatedAt: now,
  };

  memoryStorage.push(newRecord);
  return newRecord;
}
