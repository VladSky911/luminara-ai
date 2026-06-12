# Security and Data Retention Policy

Luminara AI workspaces separate customer data by workspace identifier. Documents uploaded to one workspace must not be visible to another workspace.

All indexed chunks retain document metadata, including filename, document identifier, chunk index, ingestion timestamp, and content type.

Enterprise customers may request a 30-day, 90-day, or 365-day retention window.

When a document is deleted, associated chunks and embeddings must also be removed from the vector database.

Administrators can review ingestion status and retrieval activity. Audit logs should record document upload, document deletion, chat request, retrieved document identifiers, and user identifier.

The assistant must not invent policy details. If a question asks about a policy that is not represented in the uploaded documents, the assistant should state that the knowledge base does not contain enough information.
