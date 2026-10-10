# HackMatch — Skill-Based Hackathon Team Formation Platform

HackMatch is an intelligent, full-stack platform designed to solve the random grouping problem at hackathons. Using a multi-factor algorithmic matching engine, HackMatch pairs participants based on complementary technical skills, shared domain interests, role diversity, and experience compatibility—empowering students to form winning squads and organizers to host and oversee high-impact hackathons.

---

## 🌟 Key Features

### For Students / Hackers
- **Intelligent Teammate Matching Engine**: Evaluates hacker profiles using a 4-factor compatibility formula to rank candidates (0–100%) with fully explainable score breakdowns.
- **Dynamic Hacker Profiles**: Declare technical stack, domain interests, preferred role (Frontend, Backend, AI/ML, UI/UX, etc.), and competition experience level.
- **Hackathon Discovery**: Browse upcoming virtual, hybrid, and in-person hackathons with live dates and locations.
- **Problem Statement Alignment**: Inspect organizer problem statements, technical track requirements, and form targeted teams around specific challenges.
- **Team Management & Rostering**: Create squads, assign team leaders, and review complete member rosters.
- **Seamless Invitation Workflow**: Send invitations to recommended hackers, manage incoming offers, and accept or decline with automatic team membership updates.

### For Hackathon Organizers
- **Organizer Control Center**: Dashboard summarizing hosted events, active tracks, and registered squads.
- **Hackathon Management**: Full CRUD operations for hackathons with mode selection (Online, In-Person, Hybrid).
- **Track & Problem Statement Creation**: Publish challenge descriptions and specify recommended technical skills.
- **Live Team & Participant Tracking**: Monitor all teams formed for each hackathon, identify team leaders, review assigned problem tracks, and inspect member rosters.

---

## 🧠 Matching Engine Scoring Architecture

The synergy between student $A$ and candidate $B$ is calculated across 4 weighted dimensions:

$$\text{Total Score} = S_{\text{skills}} + S_{\text{interests}} + S_{\text{role}} + S_{\text{experience}} \quad (\text{Max: 100})$$

1. **Skill Complementarity (40 Points)**:
   - Evaluates whether candidate $B$ brings technical skills that student $A$ does not possess, preventing redundant skill sets (e.g., pairing a Frontend dev with a Backend engineer).
   - Partial overlap provides baseline compatibility; non-overlapping complementary skills earn high synergy points.
2. **Interest & Domain Overlap (25 Points)**:
   - Jaccard similarity between domain interests (e.g., FinTech, AI, Web3, HealthTech).
3. **Role Diversity (20 Points)**:
   - Rewards different but synergistic roles (e.g., Frontend + Backend, AI + Fullstack, UI/UX + Developer) with maximum points (20/20).
   - Identical roles receive reduced diversity points (5/20).
4. **Experience Compatibility (15 Points)**:
   - Matches complementary experience tiers (e.g., Senior + Beginner mentorship pairing or Intermediate + Advanced synergy).

---

## 🛠️ Technology Stack

### Backend
- **Language**: Java 17
- **Framework**: Spring Boot 4.1.x
- **Security**: Spring Security 6 with stateless JWT authentication & BCrypt password hashing
- **Persistence**: Spring Data JPA / Hibernate ORM
- **Database**: MySQL (Production) / H2 In-Memory (Test Suite)
- **Architecture**: DTO-first pattern with strict separation between JPA entities and API contracts
- **Testing**: JUnit 5, Mockito, Spring Boot Starter Test (21 unit tests covering services and security)

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: React Router DOM v7 (Role-based `ProtectedRoute` guards for `STUDENT` and `ORGANIZER`)
- **State & Auth**: `AuthContext` with persistent local storage, auto-login, and session validation
- **HTTP Client**: Axios with request/response interceptors for automatic JWT injection and 401 handling
- **Design System**: Vanilla CSS design system with HSL dark mode, glassmorphism, responsive grids, and micro-animations

---

## 🚀 Getting Started

### Prerequisites
- Java 17+ installed
- Node.js 18+ and npm installed
- MySQL Server (optional for testing, required for local production run)

### 1. Backend Setup

Configure your environment variables (or rely on defaults in `application.properties`):

```bash
export DB_URL="jdbc:mysql://localhost:3306/hackmatch?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC"
export DB_USERNAME="root"
export DB_PASSWORD="your_password"
export JWT_SECRET="c29tZV9zdXBlcl9zZWNyZXRfa2V5X2Zvcl9qd3RfZ2VuZXJhdGlvbl8xMjM0NTY3ODkw"
```

Run tests to verify configuration:
```bash
cd backend
./mvnw test
```

Start the Spring Boot server:
```bash
./mvnw spring-boot:run
```
The backend API starts on `http://localhost:8080`.

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
The frontend application will be running on `http://localhost:5173`.

---

## 📡 API Reference Overview

### Public & Authentication Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user (`STUDENT` or `ORGANIZER`) |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT token |
| `GET` | `/api/hackathons` | Explore all public hackathons |
| `GET` | `/api/hackathons/{id}` | Get hackathon details |
| `GET` | `/api/hackathons/{id}/problems` | List problem statements for a hackathon |

### Student Endpoints (`ROLE_STUDENT`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/student/profile` | Get logged-in student's profile |
| `POST` | `/api/student/profile` | Create hacker profile |
| `PUT` | `/api/student/profile` | Update hacker profile |
| `GET` | `/api/student/matches` | Get ranked compatible teammates with score breakdowns |
| `GET` | `/api/student/teams` | List teams student belongs to or leads |
| `POST` | `/api/student/teams` | Create a new team |
| `GET` | `/api/student/teams/{id}` | Get team details and member list |
| `POST` | `/api/student/invitations` | Invite a candidate to a team |
| `GET` | `/api/student/invitations/received`| Get received team invitations |
| `GET` | `/api/student/invitations/sent` | Get sent team invitations |
| `PUT` | `/api/student/invitations/{id}/accept`| Accept invitation and join team |
| `PUT` | `/api/student/invitations/{id}/reject`| Decline team invitation |

### Organizer Endpoints (`ROLE_ORGANIZER`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/organizer/hackathons` | List hackathons hosted by this organizer |
| `POST` | `/api/organizer/hackathons` | Create a new hackathon |
| `GET` | `/api/organizer/hackathons/{id}` | Get organizer hackathon details |
| `PUT` | `/api/organizer/hackathons/{id}` | Update hackathon |
| `DELETE`| `/api/organizer/hackathons/{id}` | Delete hackathon (ownership enforced) |
| `GET` | `/api/organizer/hackathons/{id}/teams` | Inspect all teams and rosters for hackathon |
| `GET` | `/api/organizer/hackathons/{id}/problems`| List problem statements for hackathon |
| `POST` | `/api/organizer/hackathons/{id}/problems`| Add problem statement track |
| `PUT` | `/api/organizer/problems/{problemId}` | Update problem statement |
| `DELETE`| `/api/organizer/problems/{problemId}`| Delete problem statement |
