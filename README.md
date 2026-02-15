# Notion-like Collaborative Workspace (Backend-Focused)

This project is a backend-heavy implementation of a Notion-like workspace system.
The primary goal was to design a **secure, scalable, multi-tenant backend** while keeping the frontend intentionally simple.

Rather than relying on managed backends or real-time databases, this project focuses on
**data modeling, authentication, authorization, and consistency guarantees**—the parts that are hardest to get right.

---

## Overview

The application allows users to create and join workspaces, manage hierarchical pages, and edit content using block-based structures similar to Notion.

Each workspace is treated as an isolated tenant, with strict authorization enforced at the API level.
The system supports role-based access, secure authentication using refresh token rotation, and optimistic frontend updates synchronized with backend state.

---

## Core Features

- Multi-tenant workspace architecture
- Role-based access control (Admin / Editor / Viewer)
- Hierarchical pages with parent–child relationships
- Block-based content system (paragraphs, headings, todos, code)
- Secure JWT authentication with refresh token rotation
- Optimistic UI updates with backend reconciliation
- Transaction-safe backend operations

---

## Architectural Decisions

### Why a Multi-Tenant Design?

Each workspace represents a separate tenant. This decision ensures:

- Clear data isolation between workspaces
- Users can belong to multiple workspaces with different roles
- Authorization logic remains explicit and enforceable at every API boundary

All pages, blocks, and permissions are scoped to a workspace to prevent cross-tenant data leakage.

---

### Authentication Strategy

Authentication is implemented using **JWT access tokens and refresh tokens** instead of session-based auth.

Key decisions:
- Short-lived access tokens for API requests
- Long-lived refresh tokens stored using a keystore pattern
- Refresh token rotation on every refresh request
- Token invalidation via keystore status instead of relying on token expiry alone

This approach improves security by:
- Preventing replay attacks
- Allowing token revocation
- Avoiding long-lived access tokens

Critical flows such as token rotation are wrapped in **database transactions** to ensure consistency.

---

### Why a Keystore Table?

Instead of storing refresh tokens directly on the user:

- Each refresh token is tied to a keystore entry
- Tokens can be invalidated independently
- Rotation logic becomes explicit and auditable
- Compromised tokens can be disabled without affecting other sessions

This mirrors patterns used in production-grade authentication systems.

---

### Database Design

The schema is designed with explicit relationships and constraints:

- Users can own and join multiple workspaces
- Workspace members are tracked with roles
- Pages support parent–child hierarchy through self-referencing relations
- Blocks are stored separately to enable flexible content rendering
- Block content is stored as JSON to support multiple block types without schema churn

The goal was clarity and correctness over premature optimization.

---

### Block System Design

Blocks are modeled as independent entities instead of embedding content inside pages.

Benefits:
- Easier reordering and insertion
- Clear separation between structure (page) and content (blocks)
- Simpler future support for drag-and-drop and real-time collaboration

Each block maintains:
- Type
- Position
- JSON content payload

---

### Frontend–Backend Flow

The frontend renders data based on workspace and page context:

- Selected workspace determines data scope
- Pages load dynamically per workspace
- Blocks render based on the active page
- Optimistic updates are applied immediately in the UI
- Backend updates reconcile and correct state if needed

This ensures a responsive user experience while maintaining backend authority.

---

## Backend Architecture

- Node.js backend with layered structure
- Prisma ORM with PostgreSQL
- Service-based business logic
- Centralized API response and error handling
- Transactions for critical write operations
- Explicit authorization checks per request

The backend is designed to be readable, testable, and extendable.

---

## What This Project Intentionally Avoids

- Managed real-time backends (e.g., Convex, Firebase)
- Abstracted authentication providers
- Over-engineering early optimizations

The focus is on **understanding and implementing core backend concepts manually**.

---

## Future Enhancements

- Real-time collaboration using WebSockets
- Multi-user presence and live cursors
- Conflict resolution strategies for concurrent edits
- Soft deletes for pages and blocks
- Page covers and icons

---

## Key Learnings

- Secure authentication systems require careful state management
- Multi-tenant authorization must be enforced consistently at every layer
- Database transactions are critical for correctness, not just performance
- Backend systems often fail at edge cases, not happy paths
- Building from first principles leads to deeper understanding than using abstractions

---

## Status

This project is actively evolving and is intended to grow into a real-time collaborative system.

