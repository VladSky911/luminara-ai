# Luminara AI Demo Script

## 1. Product Framing

Luminara AI is a transparent RAG knowledge-base platform. It answers questions from uploaded documents and shows the evidence behind every answer.

## 2. Upload Demo Documents

Upload the files from `sample_documents`.

Explain:

- documents are parsed into text
- text is split into overlapping chunks
- chunks are embedded
- vectors are stored in Qdrant
- questions retrieve relevant chunks before answer generation

## 3. Ask A Grounded Question

```text
What retention windows are available for enterprise customers?
```
