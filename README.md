# Talk Project

## Tech Stack
- **Backend**: 
  - Java 21 & Spring Boot 4.0.5
  - Spring Data JPA (PostgreSQL - Users, Rooms, Metadata)
  - Spring Data MongoDB (Message History, Chat Logs)
  - Spring Security (JWT / OAuth2 Resource Server)
  - Redis (Caching, Session Management & **WebSocket Pub/Sub**)
  - WebSocket (STOMP over SockJS)
  - MapStruct & Lombok
- **Frontend**:
  - React 19 (Vite 8)
  - Material UI (MUI v7)
  - React Router v7
  - State Management: **TanStack Query (React Query)**
  - Real-time: **@stomp/stompjs** & **sockjs-client**
  - Form: React Hook Form + Zod
- **Infrastructure**:
  - Docker & Docker Compose
  - Nginx (Reverse Proxy with WebSocket support)
  - Databases: PostgreSQL, MongoDB, Redis

## Architecture
### Backend Structure (`com.talktalk`)
- `.controller`: REST API endpoints.
- `.service`: Business logic interfaces.
- `.service.impl`: Business logic implementations.
- `.repository.jpa`: PostgreSQL repositories.
- `.repository.mongo`: MongoDB repositories (Optimized for chat history).
- `.model.entity`: PostgreSQL entities (RDBMS).
- `.model.document`: MongoDB documents (NoSQL).
- `.dto`: Data Transfer Objects for API requests/responses.
- `.messaging`: WebSocket/STOMP handlers and message distribution logic.
- `.config`: System configurations (Security, WebSocket, Redis, etc.).
- `.exception`: Custom exception handling & `ErrorCode` enum.

### Frontend Structure (`src/`)
- `/apis`: API definitions and Axios instances.
- `/components`: Reusable UI components (Common, Layout, Chat).
- `/hooks`: Custom React hooks (e.g., `useSocket`, `useAuth`).
- `/pages`: Main page components.
- `/styles`: Global styles and MUI theme customization.
- `/utils`: Helper functions, constants, and validation schemas.

## Conventions
### Naming & Coding Style
- **Java**: `PascalCase` for classes, `camelCase` for methods/variables.
- **JavaScript/JSX**: `PascalCase` for components, `camelCase` for hooks/functions.
- **Database**: `snake_case` for PostgreSQL columns; `camelCase` for MongoDB fields.
- **REST API**: `/api/v1/resource` style, plural nouns for collections.

### Real-time Standards
- **Protocol**: Use STOMP over SockJS for robust WebSocket connections.
- **Payload**: All real-time messages must include `senderId`, `roomId`, `messageType`, and `timestamp`.
- **Optimization**: Use **Optimistic UI** updates for message sending to improve user experience.

### General Rules
- Never expose Entities/Documents directly; always use **DTOs**.
- Handle all business logic in the `Service` layer, keep `Controllers` lean.
- Centralized error handling via `GlobalExceptionHandler` (Backend) and `Error Boundaries` (Frontend).

## Important Files
- `docker-compose.yml`: Main entry point for local development stack.
- `backend/src/main/resources/application.yaml`: Core configurations (DBs, JWT, Broker).
- `nginx/talktalk.conf`: Nginx configuration with `Upgrade` and `Connection` headers for WS.
- `frontend/vite.config.js`: Vite build and dev-proxy settings.

## Development Commands
- **Run all services**: `docker-compose up -d`
- **Backend (Dev)**: `./mvnw spring-boot:run`
- **Frontend (Dev)**: `npm run dev`
- **Build Backend**: `./mvnw clean package -DskipTests`
- **Build Frontend**: `npm run build`