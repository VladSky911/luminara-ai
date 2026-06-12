import {
  Bot,
  FileText,
  Gauge,
  Layers3,
  MessageSquare,
  Search,
  ShieldCheck,
  Sparkles,
  UploadCloud,
} from "lucide-react";

const documents = [
  {
    name: "Customer onboarding.md",
    status: "Indexed",
    chunks: 8,
    tone: "bg-[#d9ff8f]",
  },
  {
    name: "Security policy.pdf",
    status: "Indexed",
    chunks: 14,
    tone: "bg-[#9ee7ff]",
  },
  {
    name: "Product notes.docx",
    status: "Processing",
    chunks: 5,
    tone: "bg-[#ffd98f]",
  },
];

const traces = [
  {
    title: "Security policy.pdf",
    score: "0.93",
    text: "Enterprise customers may request a 30-day, 90-day, or 365-day retention window.",
  },
  {
    title: "Customer onboarding.md",
    score: "0.88",
    text: "Production rollout begins after the pilot owner approves retrieval quality.",
  },
  {
    title: "Product notes.docx",
    score: "0.81",
    text: "Answers should include source references and expose the evidence chain.",
  },
];

export default function Home() {
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
            <div className="mt-3 rounded-2xl bg-[#d9ff8f] px-3 py-2 text-sm font-semibold text-[#171412]">
              Strict grounding
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

            <button className="flex items-center gap-2 rounded-2xl bg-[#171412] px-4 py-3 text-sm font-medium text-white">
              <UploadCloud size={17} />
              Upload
            </button>
          </header>

          <div className="grid flex-1 gap-5 p-5 xl:grid-cols-[360px_1fr_380px]">
            <section className="rounded-[1.6rem] border border-black/10 bg-white/70 p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold">Documents</h2>
                <span className="rounded-full bg-[#171412] px-3 py-1 text-xs text-white">
                  3 files
                </span>
              </div>

              <div className="space-y-3">
                {documents.map((doc) => (
                  <article
                    key={doc.name}
                    className="rounded-3xl border border-black/10 bg-white p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-1 h-3 w-3 rounded-full ${doc.tone}`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium">{doc.name}</div>
                        <div className="mt-1 text-sm text-[#6a645b]">
                          {doc.status} · {doc.chunks} chunks
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
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

                <div className="rounded-3xl border border-black/10 bg-white p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm text-[#6a645b]">
                    <Search size={16} />
                    Question
                  </div>
                  <p className="text-xl font-medium leading-8 tracking-[-0.01em]">
                    What retention windows are available for enterprise
                    customers?
                  </p>
                </div>

                <div className="mt-4 rounded-3xl bg-[#fff4d7] p-5">
                  <p className="text-sm leading-7 text-[#5d4a1b]">
                    Enterprise customers may request 30-day, 90-day, or 365-day
                    retention windows. When a document is deleted, its chunks
                    and embeddings should also be removed from the vector
                    database.
                  </p>
                  <div className="mt-4 flex gap-2">
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium">
                      [1] Security policy.pdf
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium">
                      Confidence 0.93
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[1.6rem] border border-black/10 bg-white/70 p-4 shadow-sm">
              <h2 className="mb-4 font-semibold">Source trace</h2>

              <div className="space-y-3">
                {traces.map((trace) => (
                  <article
                    key={trace.title}
                    className="rounded-3xl border border-black/10 bg-white p-4"
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="truncate font-medium">{trace.title}</div>
                      <div className="rounded-full bg-[#171412] px-3 py-1 text-xs text-white">
                        {trace.score}
                      </div>
                    </div>
                    <p className="text-sm leading-6 text-[#625d54]">
                      {trace.text}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
