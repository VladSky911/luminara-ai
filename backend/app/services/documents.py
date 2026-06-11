from fastapi import UploadFile

from app.schemas.documents import DocumentChunk, DocumentRecord
from app.services.chunking import chunk_text
from app.services.text_extraction import extract_text

DOCUMENTS: dict[str, DocumentRecord] = {}
DOCUMENT_CHUNKS: dict[str, list[DocumentChunk]] = {}


async def create_document(file: UploadFile) -> DocumentRecord:
    content = await file.read()

    document = DocumentRecord(
        filename=file.filename or "untitled",
        content_type=file.content_type or "application/octet-stream",
        size_bytes=len(content),
        status="processing",
    )

    text = await extract_text(file, content)
    chunks = chunk_text(text, document.id)

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