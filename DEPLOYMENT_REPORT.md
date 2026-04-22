# Detailed Project Deployment & Infrastructure Thesis
## Project: Retail Inventory Management System

This document provides a comprehensive technical breakdown of the architectural decisions, cloud infrastructure, and automated deployment strategies implemented for the Retail Inventory System.

---

### 1. Advanced System Architecture
The application is designed using a **Microservices-oriented approach**, encapsulated within Docker containers to ensure environmental parity across development and production.

*   **Frontend (React.js)**: A Single Page Application (SPA) that manages state on the client side, reducing the load on the server.
*   **Backend (Node.js/Express)**: A stateless REST API that handles business logic, authentication (JWT), and database orchestration.
*   **Database (PostgreSQL via Supabase)**: We utilized a managed cloud database to ensure data durability, automatic backups, and high availability.
*   **Reverse Proxy (Nginx)**: Acts as the entry point for all HTTP traffic, handling SSL termination (if applied) and static file serving.

---

### 2. Cloud Infrastructure Deep-Dive: AWS EC2
We chose **Amazon Web Services (AWS)** for its global infrastructure and security features.

*   **Instance Class**: `t3.small` (2 vCPUs, 2 GB RAM). 
    *   *Technical Rationale*: Unlike `t2.micro`, the `t3` series uses **Nitro System** for better networking performance and allows for "Burstable CPU" performance, which is essential during heavy Docker build processes.
*   **Virtual Private Cloud (VPC)**: The instance sits within a default VPC with a public IPv4 address (`15.135.192.6`).
*   **Security Group Configuration**:
    *   `TCP Port 80`: Restricted to HTTP traffic for the web interface.
    *   `TCP Port 5000`: Exposed specifically for the Frontend-to-Backend API handshake.
    *   `TCP Port 22`: Secured via RSA-2048 bit SSH keys for administrative access.

---

### 3. Containerization Strategy: Docker Engineering
Docker allows us to package the "Process" and "Environment" together.

#### A. Multi-Stage Frontend Build
We implemented a **Multi-Stage Build** in the `frontend/Dockerfile` to optimize for production:
1.  **Builder Stage**: Uses Node.js to run `npm run build`. This generates minified bundles.
2.  **Production Stage**: Uses a lightweight Nginx image (Alpine). We only copy the `/build` folder. This reduces the image size from ~1.2GB to less than 40MB.

#### B. Backend Persistence & Networking
The backend is configured with a **Bridge Network**. This allows it to talk to the database securely while only exposing the necessary API port (`5000`) to the host.

---

### 4. Technical Code Analysis (Line-by-Line Breakdown)

#### A. Frontend Dockerfile (`frontend/Dockerfile`)
| Line | Instruction | Technical Deep-Dive |
| :--- | :--- | :--- |
| `FROM node:18-alpine` | Base Image | Uses Alpine Linux for a minimal security attack surface. |
| `ARG REACT_APP_API_URL` | Build Argument | Allows us to inject the Production API URL *during* the build process, not after. |
| `ENV REACT_APP_API_URL` | Environment Var | Persists the URL within the compiled React code. |
| `COPY --from=build` | Artifact Transfer | Transfers only the "distributable" assets, leaving behind development tools. |
| `CMD ["nginx", "-g"]` | Entrypoint | Starts the Nginx daemon in the foreground so the container doesn't exit. |

#### B. Production Orchestration (`docker-compose.production.yml`)
| Line | Instruction | Technical Deep-Dive |
| :--- | :--- | :--- |
| `version: '3.8'` | Schema Version | Defines the capabilities of the Compose engine (e.g., resource limits). |
| `ports: "80:80"` | Port Mapping | Maps Host Port 80 to Container Port 80 (Standard Web Traffic). |
| `depends_on` | Boot Sequencing | Ensures the Backend is healthy before the Frontend starts, preventing 502 Gateway errors. |
| `restart: always` | Self-Healing | Implements a restart policy that ensures the service recovers from system reboots or crashes. |

---

### 5. Deployment Lifecycle & CLI Operations
These are the exact commands executed on the AWS environment to maintain the application.

| Command | Technical Action | Why is it critical? |
| :--- | :--- | :--- |
| `git pull origin main` | Repository Synchronization | Fetches the latest commits. Uses GitHub Access Tokens for secure authentication. |
| `docker compose up --build -d` | Deployment Orchestration | **--build**: Forces Docker to re-evaluate all layers and apply new code. **-d**: Detached mode runs the system as a background service. |
| `docker ps -a` | Process Monitoring | Shows the status of all containers, including uptime and port mappings. |
| `docker logs --tail 50 backend` | Log Inspection | Retrieves the last 50 lines of API logs for real-time debugging. |
| `docker image prune -af` | Storage Optimization | Deletes "Dangling" images (old versions) to prevent the 8GB EC2 disk from filling up. |

---

### 6. Security & CI/CD Automation
*   **GitHub Actions**: We used a `.github/workflows/deploy.yml` to automate the SSH handshake.
*   **Secrets Management**: Sensitive data like `AWS_SSH_KEY` and `DB_PASSWORD` are never stored in plain text. They are injected as "Encrypted Secrets" during the deployment runtime.
*   **CORS (Cross-Origin Resource Sharing)**: The backend is locked down to only accept requests from the server's specific IP, mitigating CSRF attacks.

---
**Prepared By**: Retail Inventory Development Team
**Lead Architect**: [Your Name/Team Name]
**Date**: April 22, 2026
