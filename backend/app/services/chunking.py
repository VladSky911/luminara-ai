from uuid import NAMESPACE_URL, uuid5

from app.schemas.documents import DocumentChunk


def chunk_text(
    text: str,
    document_id: str,
    chunk_size: int = 900,
    overlap: int = 160,
) -> list[DocumentChunk]:
    normalized = " ".join(text.split())

    if not normalized:
        return []

    chunks: list[DocumentChunk] = []
    start = 0
    index = 0

    while start < len(normalized):
        end = min(start + chunk_size, len(normalized))
        chunk = normalized[start:end].strip()

        if chunk:
            chunk_id = str(uuid5(NAMESPACE_URL, f"{document_id}:{index}"))
            chunks.append(
                DocumentChunk(
                    id=chunk_id,
                    document_id=document_id,
                    chunk_index=index,
                    text=chunk,
                    token_estimate=max(1, len(chunk) // 4),
                )
            )

        if end == len(normalized):
            break

        start = max(0, end - overlap)
        index += 1

    return chunks