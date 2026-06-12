# Luminara AI

**Luminara AI** is a fullstack RAG knowledge-base platform that turns documents into an evidence-based AI assistant.

Upload PDFs, DOCX files, Markdown, or text documents. Luminara extracts the content, splits it into searchable chunks, creates embeddings, stores them in Qdrant, and answers questions with citations and retrieval traces.

The goal of this project is not just to build another “chat with PDF” demo. Luminara AI is designed around transparency: users can inspect which document chunks were retrieved, how relevant they were, and which sources support the answer.

## Why This Project Exists

Most AI document tools feel like a black box.

Luminara AI focuses on three things:

- **Grounded answers**: responses are based on retrieved document chunks.
- **Visible evidence**: every answer includes citations and source snippets.
- **Inspectable retrieval**: users can see semantic scores and retrieved context.

This project was built as a portfolio piece for **AI Builder / Fullstack Developer** roles.

## Features

- Upload `.pdf`, `.docx`, `.md`, and `.txt` files
- Extract text from documents
- Split documents into overlapping chunks
- Generate embeddings
- Use Qdrant for vector search
- Ask questions against the knowledge base
- Generate RAG answers with citations
- Show retrieval trace with semantic scores
- Support answer modes:
  - `strict`
  - `balanced`
  - `exploratory`
- Local embedding fallback when no OpenAI API key is configured
- Modern Next.js dashboard UI

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide icons

### Backend

- FastAPI
- Python
- Pydantic
- OpenAI SDK
- Qdrant client
- pypdf
- python-docx

### Infrastructure

- Docker Compose
- Qdrant vector database

## Architecture

```text
Document Upload
      ↓
Text Extraction
      ↓
Chunking With Overlap
      ↓
Embedding Generation
      ↓
Qdrant Vector Indexing
      ↓
Semantic Search
      ↓
RAG Prompt Construction
      ↓
Answer With Citations
      ↓
Retrieval Trace In UI


```
Project Structure
luminara-ai/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   └── config.py
│   │   ├── schemas/
│   │   │   ├── answers.py
│   │   │   ├── documents.py
│   │   │   └── search.py
│   │   ├── services/
│   │   │   ├── chunking.py
│   │   │   ├── documents.py
│   │   │   ├── embeddings.py
│   │   │   ├── generation.py
│   │   │   ├── text_extraction.py
│   │   │   └── vector_store.py
│   │   └── main.py
│   └── pyproject.toml
├── frontend/
│   ├── app/
│   ├── lib/
│   └── package.json
├── sample_documents/
├── docs/
├── docker-compose.yml
├── .env.example
└── README.md

Getting Started
1. Clone The Repository
git clone https://github.com/YOUR_USERNAME/luminara-ai.git
cd luminara-ai
2. Create Environment File
Copy the example environment file:
cp .env.example .env
Example:
OPENAI_API_KEY=
OPENAI_CHAT_MODEL=gpt-4.1-mini
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
QDRANT_URL=http://localhost:6333
QDRANT_COLLECTION=luminara_chunks
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
OPENAI_API_KEY is optional.
Without it, Luminara AI uses a deterministic local embedding fallback and a local demo answer generator. This makes the project easy to run locally without paid API access.
3. Start Qdrant
Make sure Docker Desktop is running, then start Qdrant:
docker compose up -d
Qdrant will be available at:
http://localhost:6333
4. Start The Backend
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -e .
uvicorn app.main:app --reload
Backend API:
http://localhost:8000
Swagger docs:
http://localhost:8000/docs
Health check:
http://localhost:8000/health
Expected response:
{
  "status": "ok",
  "service": "Luminara AI",
  "version": "0.1.0"
}
5. Start The Frontend
Open a second terminal:
cd frontend
npm install
npm run dev
Frontend app:
http://localhost:3000
Demo Flow
Start Qdrant with Docker.
Start the FastAPI backend.
Start the Next.js frontend.
Upload a PDF, DOCX, Markdown, or text file.
Ask a question about the uploaded document.
Inspect the answer, citations, and source trace.
Example Questions
After uploading documents, try:
What does this document say?
What are the main requirements?
Summarize the key points with sources.
What information is missing from the knowledge base?
API Endpoints
Health
GET /health
Returns service status.
Documents
GET /documents
Returns uploaded document metadata.
POST /documents
Uploads and indexes a document.
Chunks
GET /documents/{document_id}/chunks
Returns extracted chunks for a document.
Embeddings Preview
GET /documents/{document_id}/embeddings
Returns a small embedding preview for document chunks.
Semantic Search
POST /search
Example body:
{
  "query": "What is this document about?",
  "top_k": 6
}
RAG Answer
POST /ask
Example body:
{
  "question": "What does the document say about retention?",
  "mode": "strict",
  "top_k": 6
}
Returns:
generated answer
citations
retrieval trace
semantic scores
Answer Modes
Strict
Answers only from retrieved sources. If the context is insufficient, the assistant should say that the knowledge base does not contain enough information.
Balanced
Answers from the sources while clearly stating uncertainty when context is incomplete.
Exploratory
Synthesizes more freely from retrieved sources while still preserving citations.
Local Fallback Mode
Luminara AI can run without an OpenAI API key.
In this mode:
embeddings are generated with a deterministic local hashing strategy;
answers are generated with a local fallback message;
Qdrant search still works;
the full upload, chunking, indexing, search, and retrieval trace flow remains testable.
This is useful for reviewers who want to run the project quickly without configuring paid services.
For full AI-generated answers, set:
OPENAI_API_KEY=your_api_key_here
What This Project Demonstrates
AI Engineering
RAG architecture
embeddings
vector search
semantic retrieval
source-grounded generation
hallucination-aware answer modes
Backend Engineering
FastAPI service design
typed schemas with Pydantic
document upload pipeline
text extraction
chunking
Qdrant integration
clean service separation
Frontend Engineering
modern Next.js app structure
TypeScript API client
document upload UI
AI question interface
citations and source trace display
responsive dashboard layout
Product Thinking
evidence-first AI UX
inspectable answers
local demo mode
practical developer setup
clear upgrade path toward production
Screenshots
Add screenshots here after running the app locally.
Recommended screenshots:
1. Dashboard with uploaded documents
2. Ask flow with generated answer
3. Source trace panel with semantic scores
4. Swagger API docs
Deployment Notes
The frontend can be deployed to Vercel, but the full app also requires a running backend and vector database.
Recommended production-style deployment:
Frontend: Vercel
Backend: Render, Railway, Fly.io, or another Python API host
Vector database: Qdrant Cloud
Environment variable:NEXT_PUBLIC_API_URL=https://your-backend-url

For this portfolio version, the project is optimized for a reliable local demo.
Future Improvements
Add persistent PostgreSQL document metadata
Add user authentication
Add workspace isolation
Add document deletion and vector cleanup
Add streaming answers
Add hybrid search with BM25 + vector retrieval
Add reranking before generation
Add evaluation metrics for retrieval quality
Add production deployment for backend and Qdrant


