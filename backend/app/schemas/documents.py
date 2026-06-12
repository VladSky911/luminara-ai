from datetime import datetime, timezone
from uuid import uuid4

from pydantic import BaseModel, Field


class DocumentChunk(BaseModel):
    id: str
    document_id: str
    chunk_index: int
    text: str
    token_estimate: int


class EmbeddingPreview(BaseModel):
    chunk_id: str
    dimensions: int
    preview: list[float]


class DocumentRecord(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    filename: str
    content_type: str
    size_bytes: int
    status: str = "uploaded"
    chunk_count: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class DocumentUploadResponse(BaseModel):
    document: DocumentRecord
    message: str


class DocumentDeleteResponse(BaseModel):
    document_id: str
    message: str