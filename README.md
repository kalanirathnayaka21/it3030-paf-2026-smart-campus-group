# Smart Campus - Facilities & Maintenance Management System

A full-stack platform designed to manage campus bookable resources (lecture halls, labs, equipment), handle booking workflows, and track maintenance incident tickets.

## Prerequisites
Ensure you have the following installed on your machine:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Docker Compose](https://docs.docker.com/compose/install/)

---

## Quick Start
To run the entire system (Backend & Frontend) for the first time:

1.  **Configure Database:** Open `docker-compose.yml` in the root directory and update the `SPRING_DATASOURCE_PASSWORD` with your actual database password.
2.  **Launch Containers:**
    ```powershell
    docker compose up --build
    ```

Once the build is complete, you can access the applications at:
- **Frontend (Web UI):** [http://localhost:3000](http://localhost:3000)
- **Backend (API):** [http://localhost:8080](http://localhost:8080)

---

## Handling Code Changes
Since the application runs inside Docker containers, you must rebuild the relevant container whenever you make changes to the source code.

### 1. Backend Changes (Spring Boot)
If you modify Java code, entity mappings, or properties in the `backend/` directory:
```powershell
docker compose up -d --build backend
```

### 2. Frontend Changes (React/Vite)
If you modify components, styles, or logic in the `frontend/` directory:
```powershell
docker compose up -d --build frontend
```

### 3. Full Restart
To stop all services and rebuild everything from scratch:
```powershell
docker compose down
docker compose up --build
```

---

## Project Structure
- **`/backend`**: Spring Boot 4.0.5 (Java 17) providing RESTful APIs, security with OAuth 2.0, and JPA persistence.
- **`/frontend`**: React + Vite application for the user interface.
- **`docker-compose.yml`**: Central orchestration for both services and environment configuration.
- **`IMPLEMENTATION_PLAN.md`**: Detailed roadmap for feature development.
