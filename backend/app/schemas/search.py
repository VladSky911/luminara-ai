from pydantic import BaseModel, Field


class SearchRequest(BaseModel):
    query: str = Field(min_length=3)
    top_k: int = Field(default=6, ge=1, le=12)


class SearchResult(BaseModel):
    document_id: str
    filename: str
    chunk_id: str
    chunk_index: int
    score: float
    text: str