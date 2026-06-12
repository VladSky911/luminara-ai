from qdrant_client import QdrantClient
from qdrant_client.models import Distance, PointStruct, VectorParams

from app.core.config import get_settings
from app.schemas.documents import DocumentChunk, DocumentRecord
from app.schemas.search import SearchResult
from app.services.embeddings import LOCAL_EMBEDDING_DIMENSIONS, embed_texts


def get_qdrant_client() -> QdrantClient:
    settings = get_settings()
    return QdrantClient(url=settings.qdrant_url)


def ensure_collection() -> None:
    settings = get_settings()
    client = get_qdrant_client()

    existing_collections = client.get_collections().collections
    existing_names = {collection.name for collection in existing_collections}

    if settings.qdrant_collection in existing_names:
        return

    client.create_collection(
        collection_name=settings.qdrant_collection,
        vectors_config=VectorParams(
            size=LOCAL_EMBEDDING_DIMENSIONS,
            distance=Distance.COSINE,
        ),
    )


async def index_document_chunks(document: DocumentRecord, chunks: list[DocumentChunk]) -> None:
    if not chunks:
        return

    ensure_collection()

    vectors = await embed_texts([chunk.text for chunk in chunks])
    points = [
        PointStruct(
            id=chunk.id,
            vector=vector,
            payload={
                "document_id": document.id,
                "filename": document.filename,
                "content_type": document.content_type,
                "chunk_id": chunk.id,
                "chunk_index": chunk.chunk_index,
                "text": chunk.text,
                "token_estimate": chunk.token_estimate,
            },
        )
        for chunk, vector in zip(chunks, vectors, strict=True)
    ]

    client = get_qdrant_client()
    client.upsert(
        collection_name=get_settings().qdrant_collection,
        points=points,
    )


async def semantic_search(query: str, top_k: int) -> list[SearchResult]:
    ensure_collection()

    query_vector = (await embed_texts([query]))[0]
    client = get_qdrant_client()

    results = client.query_points(
    collection_name=get_settings().qdrant_collection,
    query=query_vector,
    limit=top_k,
    with_payload=True,
).points

    search_results: list[SearchResult] = []

    for result in results:
        payload = result.payload or {}
        search_results.append(
            SearchResult(
                document_id=str(payload.get("document_id", "")),
                filename=str(payload.get("filename", "Unknown document")),
                chunk_id=str(payload.get("chunk_id", result.id)),
                chunk_index=int(payload.get("chunk_index", 0)),
                score=float(result.score),
                text=str(payload.get("text", "")),
            )
        )

    return search_results