import hashlib
import math

from openai import AsyncOpenAI

from app.core.config import get_settings

LOCAL_EMBEDDING_DIMENSIONS = 384


async def embed_texts(texts: list[str]) -> list[list[float]]:
    settings = get_settings()

    if settings.openai_api_key:
        client = AsyncOpenAI(api_key=settings.openai_api_key)
        response = await client.embeddings.create(
            model=settings.openai_embedding_model,
            input=texts,
        )
        return [item.embedding for item in response.data]

    return [local_embedding(text) for text in texts]


def local_embedding(text: str) -> list[float]:
    vector = [0.0] * LOCAL_EMBEDDING_DIMENSIONS

    for token in text.lower().split():
        digest = hashlib.sha256(token.encode("utf-8")).digest()
        index = int.from_bytes(digest[:4], "big") % LOCAL_EMBEDDING_DIMENSIONS
        sign = 1.0 if digest[4] % 2 else -1.0
        vector[index] += sign

    norm = math.sqrt(sum(value * value for value in vector)) or 1.0
    return [value / norm for value in vector]