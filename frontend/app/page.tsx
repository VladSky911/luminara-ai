const stats = [
  { label: "Documents", value: "0" },
  { label: "Indexed chunks", value: "0" },
  { label: "Retrieval mode", value: "Strict" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f6f3ec] text-[#171412]">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6">
        <header className="flex items-center justify-between border-b border-black/10 pb-5">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#8a6f3d]">
              Luminara AI
            </p>
            <h1 className="mt-2 text-2xl font-semibold">
              Evidence-based knowledge workspace
            </h1>
          </div>

          <div className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm text-[#5f5a52] shadow-sm">
            Local demo
          </div>
        </header>

        <div className="grid flex-1 gap-6 py-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="flex flex-col justify-center">
            <div className="max-w-2xl">
              <div className="mb-6 inline-flex rounded-full border border-[#d9c790] bg-[#fffaf0] px-4 py-2 text-sm text-[#725c23]">
                Transparent RAG for teams that need trusted answers
              </div>

              <h2 className="text-5xl font-semibold leading-[1.02] tracking-[-0.03em] md:text-7xl">
                Ask your documents.
                <span className="block text-[#b8872f]">See the evidence.</span>
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-[#625d54]">
                Luminara AI turns internal documents into a searchable AI
                knowledge base with citations, semantic retrieval, and
                inspectable source traces.
              </p>
            </div>

            <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-black/10 bg-white/65 p-4 shadow-sm"
                >
                  <div className="text-2xl font-semibold">{stat.value}</div>
                  <div className="mt-1 text-sm text-[#6a645b]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="flex items-center">
            <div className="w-full rounded-[2rem] border border-black/10 bg-[#171412] p-4 shadow-2xl">
              <div className="rounded-[1.5rem] bg-[#f9f7f1] p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#8a6f3d]">Retrieval preview</p>
                    <h3 className="text-xl font-semibold">Source trace</h3>
                  </div>
                  <div className="rounded-full bg-[#d9ff8f] px-3 py-1 text-sm font-medium">
                    Ready
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    "Customer onboarding",
                    "Security policy",
                    "Product notes",
                  ].map((title, index) => (
                    <div
                      key={title}
                      className="rounded-2xl border border-black/10 bg-white p-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="font-medium">{title}</div>
                          <div className="mt-1 text-sm text-[#6a645b]">
                            Chunk {index + 1} · semantic match
                          </div>
                        </div>
                        <div className="rounded-full bg-[#171412] px-3 py-1 text-sm text-white">
                          {(0.91 - index * 0.07).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl bg-[#fff4d7] p-4 text-sm leading-6 text-[#5d4a1b]">
                  Answers are generated only after relevant document chunks are
                  retrieved and attached as evidence.
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
