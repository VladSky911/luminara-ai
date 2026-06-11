from io import BytesIO

from docx import Document
from fastapi import HTTPException, UploadFile
from pypdf import PdfReader


SUPPORTED_EXTENSIONS = {".txt", ".md", ".pdf", ".docx"}


async def extract_text(file: UploadFile, content: bytes) -> str:
    filename = file.filename or ""
    lower_filename = filename.lower()

    if lower_filename.endswith(".txt") or lower_filename.endswith(".md"):
        return extract_plain_text(content)

    if lower_filename.endswith(".pdf"):
        return extract_pdf_text(content)

    if lower_filename.endswith(".docx"):
        return extract_docx_text(content)

    raise HTTPException(
        status_code=400,
        detail=f"Unsupported file type. Supported formats: {', '.join(sorted(SUPPORTED_EXTENSIONS))}.",
    )


def extract_plain_text(content: bytes) -> str:
    return content.decode("utf-8", errors="ignore")


def extract_pdf_text(content: bytes) -> str:
    reader = PdfReader(BytesIO(content))
    pages = []

    for page in reader.pages:
        pages.append(page.extract_text() or "")

    return "\n".join(pages)


def extract_docx_text(content: bytes) -> str:
    document = Document(BytesIO(content))
    paragraphs = [paragraph.text for paragraph in document.paragraphs if paragraph.text.strip()]
    return "\n".join(paragraphs)