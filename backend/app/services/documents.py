from fastapi import UploadFile

from app.schemas.documents import DocumentChunk, DocumentRecord
from app.services.chunking import chunk_text
from app.services.text_extraction import extract_text
from app.services.vector_store import index_document_chunks

DOCUMENTS: dict[str, DocumentRecord] = {}
DOCUMENT_CHUNKS: dict[str, list[DocumentChunk]] = {}


async def create_document(file: UploadFile) -> DocumentRecord:
    content = await file.read()
    text = await extract_text(file, content)

    document = DocumentRecord(
        filename=file.filename or "untitled",
        content_type=file.content_type or "application/octet-stream",
        size_bytes=len(content),
        status="processing",
    )

    chunks = chunk_text(text, document.id)

    if chunks:
        await index_document_chunks(document, chunks)

    document = document.model_copy(
        update={
            "status": "indexed" if chunks else "failed",
            "chunk_count": len(chunks),
        }
    )

    DOCUMENTS[document.id] = document
    DOCUMENT_CHUNKS[document.id] = chunks

    return document


def list_documents() -> list[DocumentRecord]:
    return list(DOCUMENTS.values())


def get_document_chunks(document_id: str) -> list[DocumentChunk]:
    return DOCUMENT_CHUNKS.get(document_id, [])