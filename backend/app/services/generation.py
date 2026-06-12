from openai import AsyncOpenAI

from app.core.config import get_settings
from app.schemas.answers import Citation
from app.schemas.search import SearchResult


MODE_INSTRUCTIONS = {
    "strict": (
        "Answer only from the provided sources. "
        "If the sources are insufficient, say that the knowledge base does not contain enough information."
    ),
    "balanced": (
        "Answer from the provided sources. If context is incomplete, clearly state what is uncertain."
    ),
    "exploratory": (
        "Synthesize from the provided sources, but keep claims grounded and cite the relevant source numbers."
    ),
}


async def generate_answer(question: str, results: list[SearchResult], mode: str) -> str:
    settings = get_settings()

    if not results:
        return "I could not find relevant information in the indexed knowledge base."

    if not settings.openai_api_key:
        return generate_local_answer(question, results, mode)

    client = AsyncOpenAI(api_key=settings.openai_api_key)

    context = "\n\n".join(
        f"[{index + 1}] {result.filename} | score={result.score:.3f}\n{result.text}"
        for index, result in enumerate(results)
    )

    response = await client.chat.completions.create(
        model=settings.openai_chat_model,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are Luminara AI, an evidence-based knowledge assistant. "
                    "Use citations like [1], [2] when making claims. "
                    f"{MODE_INSTRUCTIONS.get(mode, MODE_INSTRUCTIONS['strict'])}"
                ),
            },
            {
                "role": "user",
                "content": f"Question:\n{question}\n\nRetrieved sources:\n{context}",
            },
        ],
        temperature=0.2 if mode == "strict" else 0.45,
    )

    return response.choices[0].message.content or ""


def generate_local_answer(question: str, results: list[SearchResult], mode: str) -> str:
    top_sources = ", ".join(
        f"[{index + 1}] {result.filename}"
        for index, result in enumerate(results[:3])
    )
    excerpt = results[0].text[:500]

    return (
        f"Local demo answer for: {question}\n\n"
        f"The most relevant retrieved sources are {top_sources}. "
        f"The strongest matching passage says: {excerpt}...\n\n"
        f"Mode: {mode}. Add OPENAI_API_KEY to enable full generated answers."
    )


def build_citations(results: list[SearchResult]) -> list[Citation]:
    return [
        Citation(
            document_id=result.document_id,
            filename=result.filename,
            chunk_id=result.chunk_id,
            chunk_index=result.chunk_index,
            score=result.score,
            excerpt=result.text[:500],
        )
        for result in results[:4]
    ]