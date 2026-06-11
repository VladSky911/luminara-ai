from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.schemas.documents import (
    DocumentChunk,
    DocumentRecord,
    DocumentUploadResponse,
    EmbeddingPreview,
)
from app.services.documents import create_document, get_document_chunks, list_documents
from app.services.embeddings import embed_texts

settings = get_settings()

app = FastAPI(
    title="Luminara AI API",
    description="Backend API for document intelligence, RAG, and source-grounded answers.",
    version=settings.api_version,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.backend_cors_origins.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {
        "status": "ok",
        "service": settings.app_name,
        "version": settings.api_version,
    }


@app.get("/documents", response_model=list[DocumentRecord])
def get_documents() -> list[DocumentRecord]:
    return list_documents()


@app.get("/documents/{document_id}/chunks", response_model=list[DocumentChunk])
def get_chunks(document_id: str) -> list[DocumentChunk]:
    chunks = get_document_chunks(document_id)

    if not chunks:
        raise HTTPException(status_code=404, detail="No chunks found for this document.")

    return chunks


@app.get("/documents/{document_id}/embeddings", response_model=list[EmbeddingPreview])
async def get_embedding_preview(document_id: str) -> list[EmbeddingPreview]:
    chunks = get_document_chunks(document_id)

    if not chunks:
        raise HTTPException(status_code=404, detail="No chunks found for this document.")

    vectors = await embed_texts([chunk.text for chunk in chunks[:3]])

    return [
        EmbeddingPreview(
            chunk_id=chunk.id,
            dimensions=len(vector),
            preview=vector[:8],
        )
        for chunk, vector in zip(chunks[:3], vectors, strict=True)
    ]


@app.post("/documents", response_model=DocumentUploadResponse)
async def upload_document(file: UploadFile = File(...)) -> DocumentUploadResponse:
    document = await create_document(file)
    return DocumentUploadResponse(
        document=document,
        message="Document uploaded and indexed into text chunks.",
    )