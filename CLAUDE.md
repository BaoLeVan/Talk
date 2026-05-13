# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

TalkTalk — real-time chat app. Frontend: React 19 + Vite (`frontend/`). Backend: Spring Boot 4 / Java 21 (`backend/`). Databases: PostgreSQL (users, conversations, friends), MongoDB Atlas (messages, attachments), Redis (OTP cache). File storage: Cloudinary. Real-time: STOMP over SockJS.

## Commands

### Frontend (`frontend/`)
```bash
npm install
npm run dev        # dev server at http://localhost:5173
npm run build      # production build
npm run lint       # ESLint
npm run preview    # preview production build
```

### Backend (`backend/`)
```bash
# Windows
mvnw.cmd spring-boot:run
mvnw.cmd test
mvnw.cmd test -Dtest=ClassName    # single test class
mvnw.cmd package -DskipTests

# Mac/Linux
./mvnw spring-boot:run
./mvnw test
```

Backend runs on port **8080**. Requires local PostgreSQL (`talktalk` db, user `postgres`, password `123456`) and Redis on `localhost:6379`. MongoDB is Atlas (URI in `application.yaml`).

## Architecture

### Frontend

- `src/main.jsx` — entry; wires React Query, `UserContextProvider`, router, and `FriendNotificationToast`
- `src/App.jsx` — root layout: 3-column shell (SideBar | ChatWindow | RightPanel) with MUI Drawers for mobile breakpoints
- `src/pages/Auth/` — login / register / OTP verify, all rendered by `Auth.jsx`
- `src/components/` — all UI: `SideBar`, `ChatWindow`, `MessageInput`, `MessageItem`, `HeaderChat`, `RightPanel`, `ProfileModal`, `UserSearchDialog`, `NotificationsList`, `FriendsList`, `FriendRequestsSent`
- `src/apis/index.js` — all REST calls via `authorizeAxios`; base URL from `utils/constants.js` (`API_ROOT = http://localhost:8080`)
- `src/apis/friendApi.js`, `attachmentApi.js` — friend and file upload calls
- `src/hooks/useStomp.js` — STOMP client hook; connects to `http://localhost:8080/ws-talk` with JWT in connect headers; exposes `subscribeRoom`, `subscribe`, `sendMessage`, `unsubscribeRoom`, `unsubscribe`
- `src/store/useChatStore.js`, `useFriendStore.js` — Zustand stores for active conversation and friend state
- `src/utils/authorizeAxios.js` — Axios instance with JWT Bearer interceptor and silent refresh on 401

`API_ROOT` and the STOMP URL are both hardcoded to `localhost:8080` — update `constants.js` and `useStomp.js` to change the target.

### Backend (`com.talktalk`)

Standard layered Spring Boot structure:

| Layer | Location |
|---|---|
| REST controllers | `controller/` |
| STOMP messaging | `messaging/` |
| Service interfaces | `service/` |
| Service implementations | `service/impl/` |
| JPA repositories (PostgreSQL) | `repository/jpa/` |
| MongoDB repositories | `repository/mongo/` |
| JPA entities | `model/entity/` |
| MongoDB documents | `model/document/` |
| DTOs | `dto/request/`, `dto/response/` |
| MapStruct mappers | `mapper/` |
| Config | `config/` |

Key points:
- **Auth**: JWT issued by `AuthServiceImpl` using `nimbus-jose-jwt`; validated by `CustomeJwtDecoder` via Spring Security OAuth2 Resource Server. Refresh token in HTTP-only cookie. Public endpoints listed in `SecurityConfig.AUTH_WHITELIST`.
- **WebSocket**: endpoint `/ws-talk` (SockJS). STOMP app prefix `/app`, broker prefixes `/topic` and `/queue`, user prefix `/user`. JWT validated in `WebSocketConfig` channel interceptor on `CONNECT`. Messages broadcast to `/topic/room.{conversationId}`.
- **Redis pub/sub**: `RedisMessageSubscriber` + `RedisConfig` fan out messages across instances.
- **MapStruct + Lombok**: annotation processor order matters — Lombok must precede MapStruct in `pom.xml` (already correct). Regenerate after adding new mapper methods with `mvnw compile`.
- **Dual DB**: relational data (User, Conversations, ConversationsMembers, Friend, FriendRequest, Role, Permission) in PostgreSQL via JPA; chat messages and attachments in MongoDB.

### API conventions
- All REST endpoints: `/api/v1/`
- Responses wrapped in `ApiResponse<T>`
- Exceptions handled centrally in `GlobalExceptionHandler`
- CORS allows `http://localhost:5173` only