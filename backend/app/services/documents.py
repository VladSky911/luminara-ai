from fastapi import UploadFile

from app.schemas.documents import DocumentRecord

DOCUMENTS: dict[str, DocumentRecord] = {}


async def create_document(file: UploadFile) -> DocumentRecord:
    content = await file.read()

    document = DocumentRecord(
        filename=file.filename or "untitled",
        content_type=file.content_type or "application/octet-stream",
        size_bytes=len(content),
    )

    DOCUMENTS[document.id] = document
    return document


def list_documents() -> list[DocumentRecord]:
    return list(DOCUMENTS.values())