from fastapi import UploadFile


async def extract_text(file: UploadFile, content: bytes) -> str:
    filename = (file.filename or "").lower()

    if filename.endswith(".txt") or filename.endswith(".md"):
        return content.decode("utf-8", errors="ignore")

    return content.decode("utf-8", errors="ignore")