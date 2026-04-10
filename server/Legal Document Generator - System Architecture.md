Legal Document Generator - System Architecture

Overview

A scalable, modular system for generating various legal documents with type-specific prompts and requirements.

Architecture Components
1. Document Registry (documentRegistry.ts)
Central registry of all supported document types with metadata and configurations.

2. Prompt Template Engine (promptTemplates/)
Separate, specialized prompts for each document type based on legal requirements.

3. Document Service Layer (documentService.ts)
Business logic for document generation, validation, and post-processing.

4. Form Schema Validator (schemas/)
Type-safe form validation for each document type.

5. LLM Provider Abstraction (llmProviders/)

Unified interface for multiple LLM providers (OpenRouter, OpenAI, Anthropic).

System Design Principles

Principle 1: Separation of Concerns
Each document type has its own prompt template
Form schemas are separate from business logic
LLM provider logic is abstracted

Principle 2: Legal Accuracy
Expert-crafted prompts per document type
Legal requirement checklists per jurisdiction
Clause libraries for reuse

Principle 3: Extensibility
Easy to add new document types
Pluggable LLM providers
Customizable output formats

Principle 4: Type Safety
TypeScript interfaces for all document types
Validated form inputs
Structured outputs

Directory Structure
server/
├── controllers/
│   └── documentController.ts              # HTTP handlers
├── services/
│   ├── documentService.ts                 # Business logic
│   └── llmService.ts                      # LLM abstraction
├── prompts/
│   ├── promptRegistry.ts                  # Prompt selection logic
│   ├── employment/
│   │   ├── standardContract.ts            # Employment contract prompt
│   │   ├── consultantAgreement.ts         # Consultant agreement prompt
│   │   └── ndaEmployment.ts               # Employment NDA prompt
│   ├── corporate/
│   │   ├── shareSubscription.ts           # Share subscription prompt
│   │   ├── memorandumOfAssociation.ts     # MoA prompt
│   │   └── boardResolution.ts             # Board resolution prompt
│   ├── intellectual-property/
│   │   ├── patentApplication.ts           # Patent filing prompt
│   │   ├── trademarkLicense.ts            # Trademark license prompt
│   │   └── copyrightAssignment.ts         # Copyright assignment prompt
│   └── common/
│       └── basePrompt.ts                  # Common instructions
├── schemas/
│   ├── employment/
│   │   └── employmentContract.schema.ts   # Zod schema
│   ├── corporate/
│   │   └── shareSubscription.schema.ts
│   └── schemaRegistry.ts                  # Schema lookup
├── models/
│   └── DocumentTemplate.ts                # MongoDB schema
├── config/
│   └── documentTypes.ts                   # Document type registry
└── types/
    └── documents.ts                       # TypeScript types

Document Type Configuration
Each document type defines:
Unique identifier (e.g., employment-contract)
Display metadata (name, description, icon)
Legal jurisdiction (India, US, UK, etc.)
Required fields and validation rules
Prompt template reference
Output format (PDF, DOCX, HTML)
Compliance requirements (labor laws, company law, IP law)
Prompt Engineering Strategy

Template Structure:
[ROLE DEFINITION] → [OUTPUT FORMAT] → [LEGAL FRAMEWORK] → 
[DOCUMENT STRUCTURE] → [INPUT DATA] → [COMPLIANCE CHECKLIST] → 
[DRAFTING GUIDELINES]

Example Categories:
Employment Law Documents:
Standard Employment Contract
Consultant/Freelancer Agreement
Non-Disclosure Agreement (Employment)
Non-Compete Agreement
Offer Letter
Termination Letter
Exit Formalities

Corporate Law Documents:
Share Subscription Agreement
Shareholders Agreement
Board Resolutions
Memorandum of Association
Articles of Association
Director Appointment Letter

Intellectual Property Documents:
Patent Assignment Agreement
Trademark License Agreement
Copyright Transfer
Software License Agreement
Technology Transfer Agreement

Commercial Contracts:
Service Agreement
Vendor Agreement
Master Service Agreement (MSA)
Statement of Work (SOW)
Purchase Order Terms

Real Estate Documents:
Lease Agreement (Commercial)
Lease Agreement (Residential)
Sale Deed
Power of Attorney
Rent Agreement
LLM Provider Strategy
Primary: OpenRouter
Access to multiple models (GPT-4o, Claude, Llama)
Cost-effective with fallback options
Model selection per document complexity
Fallback: OpenAI Direct
For critical documents
Higher reliability

Model Selection Logic:
Simple documents (offer letters, termination): GPT-3.5-turbo
Standard contracts: GPT-4o / Claude-3-Sonnet
Complex agreements (M&A, IP): GPT-4o / Claude-3-Opus
Database Schema

DocumentTemplate Collection:
typescript
{
  _id: ObjectId,
  documentType: "employment-contract",
  version: "1.0",
  promptTemplate: "employment/standardContract",
  schemaVersion: "1.0",
  jurisdiction: ["India", "Karnataka"],
  applicableLaws: ["Industrial Disputes Act", "Shops and Establishments Act"],
  requiredSections: [...],
  optionalSections: [...],
  createdAt: Date,
  updatedAt: Date,
  status: "active" | "deprecated"
}

Generated Document Collection:
typescript
{
  _id: ObjectId,
  userId: ObjectId,
  documentType: "employment-contract",
  templateVersion: "1.0",
  formData: {...},
  generatedContent: "HTML content",
  modelUsed: "openai/gpt-4o",
  status: "draft" | "reviewed" | "finalized",
  generatedAt: Date,
  downloadHistory: [...]
}

Next Steps for Implementation
Phase 1: Create document type registry
Phase 2: Build prompt template system
Phase 3: Implement schema validation
Phase 4: Add more document types
Phase 5: Build template versioning system
Phase 6: Add legal review workflow