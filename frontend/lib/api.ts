export type DocumentRecord = {
  id: string;
  filename: string;
  content_type: string;
  size_bytes: number;
  status: string;
  chunk_count: number;
  created_at: string;
};

export type SearchResult = {
  document_id: string;
  filename: string;
  chunk_id: string;
  chunk_index: number;
  score: number;
  text: string;
};

export type Citation = {
  document_id: string;
  filename: string;
  chunk_id: string;
  chunk_index: number;
  score: number;
  excerpt: string;
};

export type AskResponse = {
  answer: string;
  citations: Citation[];
  retrieval_trace: SearchResult[];
};

export type AskMode = "strict" | "balanced" | "exploratory";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export async function fetchDocuments(): Promise<DocumentRecord[]> {
  const response = await fetch(`${API_URL}/documents`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load documents");
  }

  return response.json();
}

export async function uploadDocument(file: File): Promise<DocumentRecord> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/documents`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail ?? "Failed to upload document");
  }

  const data = await response.json();
  return data.document;
}

export async function askKnowledgeBase(
  question: string,
  mode: AskMode,
): Promise<AskResponse> {
  try {
    const response = await fetch(`${API_URL}/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
        mode,
        top_k: 6,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(
        error?.detail ?? `Ask request failed with status ${response.status}`,
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Cannot reach backend. Check that FastAPI is running on http://localhost:8000.",
      );
    }

    throw error;
  }
}
