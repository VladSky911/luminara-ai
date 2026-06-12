"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  Bot,
  FileText,
  Gauge,
  Layers3,
  Loader2,
  MessageSquare,
  Search,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  Trash2,
} from "lucide-react";

import {
  AskMode,
  AskResponse,
  DocumentRecord,
  askKnowledgeBase,
  fetchDocuments,
  uploadDocument,
  deleteDocument,
} from "@/lib/api";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function statusTone(status: string) {
  if (status === "indexed") return "bg-[#d9ff8f]";
  if (status === "processing") return "bg-[#ffd98f]";
  if (status === "failed") return "bg-[#ff9e9e]";
  return "bg-[#9ee7ff]";
}

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [asking, setAsking] = useState(false);
  const [question, setQuestion] = useState("What does the knowledge base say?");
  const [mode, setMode] = useState<AskMode>("strict");
  const [answer, setAnswer] = useState<AskResponse | null>(null);
  const [error, setError] = useState("");
  const [deletingDocumentId, setDeletingDocumentId] = useState<string | null>(
    null,
  );

  const indexedCount = useMemo(
    () => documents.filter((document) => document.status === "indexed").length,
    [documents],
  );

  const chunkCount = useMemo(
    () =>
      documents.reduce((total, document) => total + document.chunk_count, 0),
    [documents],
  );

  async function loadDocuments() {
    setError("");
    setLoadingDocuments(true);

    try {
      setDocuments(await fetchDocuments());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load documents");
    } finally {
      setLoadingDocuments(false);
    }
  }

  async function handleDeleteDocument(documentId: string, filename: string) {
    const confirmed = window.confirm(
      `Delete "${filename}" from the knowledge base?`,
    );

    if (!confirmed) return;

    setError("");
    setDeletingDocumentId(documentId);

    try {
      await deleteDocument(documentId);
      setDocuments((current) =>
        current.filter((document) => document.id !== documentId),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete document",
      );
    } finally {
      setDeletingDocumentId(null);
    }
  }

  async function handleFileChange(file: File | null) {
    if (!file) return;

    setError("");
    setUploading(true);

    try {
      const document = await uploadDocument(file);
      setDocuments((current) => [
        document,
        ...current.filter((item) => item.id !== document.id),
      ]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to upload document",
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function handleAsk(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (question.trim().length < 3) return;

    setError("");
    setAsking(true);

    try {
      setAnswer(await askKnowledgeBase(question.trim(), mode));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to ask knowledge base",
      );
    } finally {
      setAsking(false);
    }
  }

  useEffect(() => {
    loadDocuments();
  }, []);

  return (
    <main className="min-h-screen bg-[#f6f3ec] text-[#171412]">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-black/10 bg-[#171412] p-5 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#d9ff8f] text-[#171412]">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="text-lg font-semibold">Luminara AI</div>
              <div className="text-sm text-white/55">Evidence workspace</div>
            </div>
          </div>

          <nav className="mt-10 space-y-2">
            {[
              ["Knowledge", Layers3],
              ["Ask", MessageSquare],
              ["Sources", FileText],
              ["Trust", ShieldCheck],
            ].map(([label, Icon]) => (
              <button
                key={label as string}
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm text-white/72 transition hover:bg-white/10 hover:text-white"
              >
                <Icon size={18} />
                {label as string}
              </button>
            ))}
          </nav>

          <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.06] p-4">
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Gauge size={16} />
              Retrieval mode
            </div>
            <div className="mt-3 rounded-2xl bg-[#d9ff8f] px-3 py-2 text-sm font-semibold capitalize text-[#171412]">
              {mode} grounding
            </div>
          </div>
        </aside>

        <section className="flex min-w-0 flex-col">
          <header className="flex items-center justify-between border-b border-black/10 bg-white/55 px-6 py-4 backdrop-blur-xl">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#8a6f3d]">
                Knowledge base
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-[-0.02em]">
                Ask documents with visible evidence
              </h1>
            </div>

            <input
              ref={fileInputRef}
              className="hidden"
              type="file"
              accept=".txt,.md,.pdf,.docx"
              onChange={(event) =>
                handleFileChange(event.target.files?.[0] ?? null)
              }
            />

            <button
              className="flex items-center gap-2 rounded-2xl bg-[#171412] px-4 py-3 text-sm font-medium text-white disabled:opacity-60"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? (
                <Loader2 className="animate-spin" size={17} />
              ) : (
                <UploadCloud size={17} />
              )}
              {uploading ? "Indexing" : "Upload"}
            </button>
          </header>

          {error ? (
            <div className="mx-5 mt-5 rounded-2xl border border-[#f0b5a9] bg-[#fff0ec] px-4 py-3 text-sm text-[#8a321f]">
              {error}
            </div>
          ) : null}

          <div className="grid flex-1 gap-5 p-5 xl:grid-cols-[360px_1fr_380px]">
            <section className="rounded-[1.6rem] border border-black/10 bg-white/70 p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold">Documents</h2>
                <span className="rounded-full bg-[#171412] px-3 py-1 text-xs text-white">
                  {documents.length} files
                </span>
              </div>

              <div className="space-y-3">
                {loadingDocuments ? (
                  <div className="flex items-center gap-2 rounded-3xl border border-black/10 bg-white p-4 text-sm text-[#6a645b]">
                    <Loader2 className="animate-spin" size={16} />
                    Loading documents
                  </div>
                ) : documents.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-black/20 bg-white/60 p-5 text-sm leading-6 text-[#6a645b]">
                    Upload a PDF, DOCX, Markdown, or text file to build the
                    knowledge base.
                  </div>
                ) : (
                  documents.map((doc) => (
                    <article
                      key={doc.id}
                      className="rounded-3xl border border-black/10 bg-white p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-1 h-3 w-3 rounded-full ${statusTone(doc.status)}`}
                        />

                        <div className="min-w-0 flex-1">
                          <div className="truncate font-medium">
                            {doc.filename}
                          </div>
                          <div className="mt-1 text-sm capitalize text-[#6a645b]">
                            {doc.status} · {doc.chunk_count} chunks
                          </div>
                          <div className="mt-2 text-xs text-[#8a8378]">
                            {formatBytes(doc.size_bytes)}
                          </div>
                        </div>

                        <button
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl text-[#8a8378] transition hover:bg-[#fff0ec] hover:text-[#b9412c] disabled:opacity-50"
                          disabled={deletingDocumentId === doc.id}
                          onClick={() =>
                            handleDeleteDocument(doc.id, doc.filename)
                          }
                          title="Delete document"
                          type="button"
                        >
                          {deletingDocumentId === doc.id ? (
                            <Loader2 className="animate-spin" size={16} />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>

            <section className="rounded-[1.6rem] border border-black/10 bg-[#171412] p-4 text-white shadow-xl">
              <div className="rounded-[1.25rem] bg-[#f9f7f1] p-5 text-[#171412]">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#d9ff8f]">
                    <Bot size={19} />
                  </div>
                  <div>
                    <h2 className="font-semibold">AI answer workspace</h2>
                    <p className="text-sm text-[#6a645b]">
                      Grounded by retrieved chunks
                    </p>
                  </div>
                </div>

                <div className="mb-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl border border-black/10 bg-white p-4">
                    <div className="text-2xl font-semibold">{indexedCount}</div>
                    <div className="mt-1 text-sm text-[#6a645b]">
                      Indexed documents
                    </div>
                  </div>
                  <div className="rounded-3xl border border-black/10 bg-white p-4">
                    <div className="text-2xl font-semibold">{chunkCount}</div>
                    <div className="mt-1 text-sm text-[#6a645b]">
                      Searchable chunks
                    </div>
                  </div>
                </div>

                <form className="space-y-4" onSubmit={handleAsk}>
                  <textarea
                    className="min-h-36 w-full resize-none rounded-3xl border border-black/10 bg-white p-4 text-base leading-7 outline-none transition focus:border-[#b8872f]"
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                  />

                  <div className="flex flex-col gap-3 2xl:flex-row 2xl:items-center 2xl:justify-between">
                    <div className="grid grid-cols-3 rounded-2xl border border-black/10 bg-white p-1 text-sm">
                      {(["strict", "balanced", "exploratory"] as AskMode[]).map(
                        (item) => (
                          <button
                            key={item}
                            className={`rounded-xl px-3 py-2 capitalize transition ${
                              mode === item
                                ? "bg-[#171412] text-white"
                                : "text-[#6a645b]"
                            }`}
                            onClick={() => setMode(item)}
                            type="button"
                          >
                            {item}
                          </button>
                        ),
                      )}
                    </div>

                    <button
                      className="flex items-center justify-center gap-2 rounded-2xl bg-[#d9ff8f] px-5 py-3 text-sm font-semibold text-[#171412] disabled:opacity-60"
                      disabled={asking || question.trim().length < 3}
                      type="submit"
                    >
                      {asking ? (
                        <Loader2 className="animate-spin" size={17} />
                      ) : (
                        <Search size={17} />
                      )}
                      {asking ? "Retrieving" : "Ask"}
                    </button>
                  </div>
                </form>

                {answer ? (
                  <div className="mt-5 rounded-3xl bg-[#fff4d7] p-5">
                    <p className="whitespace-pre-wrap text-sm leading-7 text-[#5d4a1b]">
                      {answer.answer}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {answer.citations.map((citation, index) => (
                        <span
                          key={citation.chunk_id}
                          className="rounded-full bg-white px-3 py-1 text-xs font-medium"
                        >
                          [{index + 1}] {citation.filename}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </section>

            <section className="rounded-[1.6rem] border border-black/10 bg-white/70 p-4 shadow-sm">
              <h2 className="mb-4 font-semibold">Source trace</h2>

              <div className="space-y-3">
                {(answer?.retrieval_trace ?? []).length === 0 ? (
                  <article className="rounded-3xl border border-black/10 bg-white p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="truncate font-medium">
                        Waiting for question
                      </div>
                      <div className="rounded-full bg-[#171412] px-3 py-1 text-xs text-white">
                        0.00
                      </div>
                    </div>
                    <p className="text-sm leading-6 text-[#625d54]">
                      Ask a question to inspect retrieved chunks, source files,
                      and semantic scores.
                    </p>
                  </article>
                ) : (
                  answer?.retrieval_trace.map((trace) => (
                    <article
                      key={trace.chunk_id}
                      className="rounded-3xl border border-black/10 bg-white p-4"
                    >
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div className="truncate font-medium">
                          {trace.filename}
                        </div>
                        <div className="rounded-full bg-[#171412] px-3 py-1 text-xs text-white">
                          {trace.score.toFixed(2)}
                        </div>
                      </div>
                      <p className="line-clamp-6 text-sm leading-6 text-[#625d54]">
                        {trace.text}
                      </p>
                    </article>
                  ))
                )}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
