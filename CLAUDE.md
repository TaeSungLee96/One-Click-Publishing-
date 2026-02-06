# CLAUDE.md — AI Assistant Guide for One-Click-Publishing

## Project Overview

**Repository:** `TaeSungLee96/One-Click-Publishing-`
**Status:** Initial setup — the project is in its earliest stage of development.
**Purpose:** One-Click Publishing — a tool/application for streamlining content publishing workflows.

## Repository Structure

```
One-Click-Publishing-/
├── proto/                        # 공유 Protobuf 정의
│   └── user.proto
├── python-user-service/          # Python gRPC 서버 (User Service)
│   ├── server.py
│   ├── requirements.txt
│   └── Dockerfile
├── nodejs-api-gateway/           # NestJS API 게이트웨이 (TypeScript)
│   ├── src/
│   │   ├── main.ts               # NestJS 부트스트랩
│   │   ├── app.module.ts         # 루트 모듈
│   │   ├── health.controller.ts  # 헬스체크
│   │   └── user/                 # User 기능 모듈
│   │       ├── user.module.ts
│   │       ├── user.controller.ts
│   │       ├── user.service.ts
│   │       ├── user-service.interface.ts
│   │       ├── grpc-client.options.ts
│   │       └── dto/
│   │           └── create-user.dto.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   └── Dockerfile
├── k8s/                          # Kubernetes 매니페스트 (OKE용)
│   ├── deployment.yml
│   └── service.yml
├── .github/workflows/            # GitHub Actions CI/CD
│   ├── ci.yml                    # 빌드 검증
│   └── deploy.yml                # Oracle Cloud 배포
├── scripts/
│   └── setup-oci-secrets.sh      # GitHub Secrets 설정 도우미
├── .env.deploy.example           # OCI 배포 설정 템플릿
├── docker-compose.yml            # 로컬 서비스 오케스트레이션
├── README.md                     # 프로젝트 문서
├── CLAUDE.md                     # AI assistant guidance
└── .git/
```

**Tech stack:** Python 3.12 (grpcio), Node.js 20 (NestJS 10 + TypeScript + @nestjs/microservices), Protobuf, Docker Compose, GitHub Actions, OCIR, OCI Compute / OKE

## Development Workflow

### Branch Strategy

- **Feature branches** should follow the pattern `claude/<description>-<session-id>` when created by AI assistants.
- Always develop on the designated feature branch; never push directly to the main branch without explicit permission.

### Git Conventions

- Write clear, descriptive commit messages focused on the "why" rather than the "what."
- Keep commits atomic — each commit should represent a single logical change.
- Use `git push -u origin <branch-name>` for pushes.

### Getting Started (for future contributors)

Once the project has source code:

1. Clone the repository.
2. Install dependencies (update this section with the actual command once a package manager is chosen).
3. Run the development server or build (update accordingly).
4. Run tests before pushing (update accordingly).

## Key Conventions

### Code Style

> To be defined once the tech stack is chosen. Update this section with:
> - Language and framework versions
> - Linter and formatter configuration (e.g., ESLint, Prettier, Black, Ruff)
> - Naming conventions (files, variables, components)

### Architecture Patterns

> To be defined. Document key patterns here as they emerge, such as:
> - Project layout (e.g., feature-based vs. layer-based)
> - State management approach
> - API design conventions
> - Error handling strategy

### Testing

> To be defined. Document:
> - Test framework and runner
> - Test file naming and location conventions
> - Coverage expectations
> - How to run tests locally

## AI Assistant Instructions

When working in this repository:

1. **Read before writing.** Always read existing files before modifying them.
2. **Keep changes minimal.** Only make changes that are directly requested or clearly necessary. Avoid over-engineering.
3. **Track tasks.** Use the TodoWrite tool to plan and track multi-step work.
4. **No security vulnerabilities.** Avoid introducing command injection, XSS, SQL injection, or other OWASP Top 10 issues.
5. **Update this file.** When making significant structural changes (new directories, new dependencies, new scripts), update CLAUDE.md to reflect the current state.
6. **Commit discipline.** Create atomic commits with descriptive messages. Never amend previous commits unless explicitly asked.
7. **Don't guess.** If something is unclear about the project's conventions or intent, note it rather than assuming.

## Build & Run Commands

| Command | Description |
|---------|-------------|
| `docker compose up --build` | 전체 서비스 빌드 및 실행 |
| `docker compose down` | 전체 서비스 중지 |
| `cd python-user-service && pip install -r requirements.txt` | Python 의존성 설치 |
| `cd nodejs-api-gateway && npm install` | Node.js 의존성 설치 |
| `cd nodejs-api-gateway && npm run build` | NestJS TypeScript 빌드 |
| `cd nodejs-api-gateway && npm run start:dev` | NestJS 개발 모드 (watch) |

## Environment & Configuration

| Variable | Service | Default | Description |
|----------|---------|---------|-------------|
| `USER_SERVICE_HOST` | api-gateway | `localhost:50051` | Python gRPC 서버 주소 |
| `PORT` | api-gateway | `3000` | REST API 포트 |

## CI/CD

- **CI** (`.github/workflows/ci.yml`): PR/push 시 Python 빌드, NestJS 빌드, Docker 이미지 빌드 검증
- **CD** (`.github/workflows/deploy.yml`): main push 시 OCIR에 이미지 푸시 → OCI Compute 또는 OKE에 배포
- 배포 대상은 GitHub Variable `DEPLOY_TARGET` (`compute` | `oke`)로 제어
- 배포 설정: `.env.deploy.example`을 `.env.deploy`로 복사 후 `scripts/setup-oci-secrets.sh` 실행

## Troubleshooting

> To be populated as common issues are encountered during development.
