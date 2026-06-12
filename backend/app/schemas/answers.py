from pydantic import BaseModel, Field

from app.schemas.search import SearchResult


class AskRequest(BaseModel):
    question: str = Field(min_length=3)
    mode: str = "strict"
    top_k: int = Field(default=6, ge=1, le=12)


class Citation(BaseModel):
    document_id: str
    filename: str
    chunk_id: str
    chunk_index: int
    score: float
    excerpt: str


class AskResponse(BaseModel):
    answer: str
    citations: list[Citation]
    retrieval_trace: list[SearchResult]