# gRPC MSA Example: Python + NestJS

Python 서비스와 NestJS 서비스가 gRPC로 통신하는 마이크로서비스 아키텍처(MSA) 예제입니다.

## 아키텍처

```
┌──────────────────────────┐   gRPC (protobuf)   ┌─────────────────────┐
│  NestJS API Gateway      │ ──────────────────▶  │  Python User Service│
│  (REST API :3000)        │                      │  (gRPC Server :50051│)
│                          │ ◀──────────────────  │                     │
│  - NestJS + TypeScript   │                      │  - grpcio           │
│  - @nestjs/microservices │                      │  - 인메모리 DB       │
│  - class-validator       │                      │                     │
└──────────────────────────┘                      └─────────────────────┘
        ▲
        │ HTTP REST
        │
   클라이언트 (curl, 브라우저 등)
```

### 서비스 구성

| 서비스 | 언어 | 프레임워크 | 역할 | 포트 |
|--------|------|-----------|------|------|
| `user-service` | Python 3.12 | grpcio | 사용자 CRUD gRPC 서버 | 50051 |
| `api-gateway` | Node.js 20 | NestJS 10 | REST → gRPC 변환 게이트웨이 | 3000 |

### 통신 흐름

1. 클라이언트가 `api-gateway`에 REST 요청 전송
2. NestJS 컨트롤러가 요청을 받아 DTO 유효성 검증 (class-validator)
3. 서비스 레이어에서 `@nestjs/microservices` gRPC 클라이언트로 `user-service` 호출
4. `user-service`가 처리 후 gRPC 응답 반환
5. `api-gateway`가 응답을 JSON으로 변환하여 클라이언트에 전달

## 프로젝트 구조

```
├── proto/                              # 공유 Protobuf 정의
│   └── user.proto
├── python-user-service/                # Python gRPC 서버
│   ├── server.py
│   ├── requirements.txt
│   └── Dockerfile
├── nodejs-api-gateway/                 # NestJS API 게이트웨이
│   ├── src/
│   │   ├── main.ts                     # NestJS 부트스트랩
│   │   ├── app.module.ts               # 루트 모듈
│   │   ├── health.controller.ts        # 헬스체크 엔드포인트
│   │   └── user/                       # User 기능 모듈
│   │       ├── user.module.ts          # gRPC 클라이언트 등록
│   │       ├── user.controller.ts      # REST 라우트 핸들러
│   │       ├── user.service.ts         # gRPC 호출 서비스
│   │       ├── user-service.interface.ts  # gRPC 서비스 타입 정의
│   │       ├── grpc-client.options.ts  # gRPC 연결 옵션
│   │       └── dto/
│   │           └── create-user.dto.ts  # 요청 유효성 검증 DTO
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   └── Dockerfile
├── k8s/                                # Kubernetes 매니페스트 (OKE용)
│   ├── deployment.yml
│   └── service.yml
├── .github/workflows/                  # GitHub Actions CI/CD
│   ├── ci.yml                          # PR/push 시 빌드 검증
│   └── deploy.yml                      # main 브랜치 → Oracle Cloud 배포
├── scripts/
│   └── setup-oci-secrets.sh            # GitHub Secrets 설정 도우미
├── .env.deploy.example                 # OCI 배포 설정 템플릿
├── docker-compose.yml                  # 로컬 서비스 오케스트레이션
└── README.md
```

## 실행 방법

### Docker Compose (권장)

```bash
docker compose up --build
```

두 서비스가 모두 시작되면 API Gateway가 `http://localhost:3000`에서 요청을 수신합니다.

### 로컬 실행 (개발용)

**1. Python User Service**

```bash
cd python-user-service
pip install -r requirements.txt

# proto 코드 생성
python -m grpc_tools.protoc \
  -I../proto \
  --python_out=. \
  --grpc_python_out=. \
  ../proto/user.proto

python server.py
```

**2. NestJS API Gateway**

```bash
cd nodejs-api-gateway
npm install

# proto 파일을 로컬에 복사 (런타임에 로드)
mkdir -p proto && cp ../proto/user.proto proto/

# 개발 모드 (watch)
npm run start:dev

# 또는 빌드 후 실행
npm run build
npm run start:prod
```

## API 사용법

### 사용자 생성

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "홍길동", "email": "hong@example.com"}'
```

응답:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "홍길동",
  "email": "hong@example.com",
  "created_at": "2026-02-06T12:00:00+00:00"
}
```

유효성 검증 실패 시 (class-validator):
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": ""}'
```

```json
{
  "statusCode": 400,
  "message": ["name은 필수입니다", "올바른 이메일 형식이어야 합니다", "email은 필수입니다"],
  "error": "Bad Request"
}
```

### 전체 사용자 목록 조회

```bash
curl http://localhost:3000/api/users
```

### 특정 사용자 조회

```bash
curl http://localhost:3000/api/users/{id}
```

### 사용자 삭제

```bash
curl -X DELETE http://localhost:3000/api/users/{id}
```

### 헬스체크

```bash
curl http://localhost:3000/health
```

## NestJS로 고도화된 포인트

| 항목 | Express 버전 | NestJS 버전 |
|------|-------------|-------------|
| 언어 | JavaScript | TypeScript |
| 구조 | 단일 파일 라우트 | 모듈/컨트롤러/서비스 패턴 |
| gRPC 연결 | 수동 proto-loader | `@nestjs/microservices` ClientsModule |
| 요청 검증 | 수동 if 체크 | `class-validator` + `ValidationPipe` |
| 에러 처리 | try-catch + 수동 응답 | NestJS 내장 예외 필터 |
| DI | 없음 | NestJS IoC 컨테이너 |
| 타입 안전성 | 없음 | TypeScript 인터페이스 |

## CI/CD — GitHub Actions + Oracle Cloud

### 파이프라인 흐름

```
 PR / push                         main 브랜치 push
     │                                     │
     ▼                                     ▼
┌──────────┐                     ┌───────────────────┐
│  CI      │                     │  Deploy           │
│          │                     │                   │
│ Python   │                     │ Docker Build      │
│  Build   │                     │      │            │
│ NestJS   │                     │      ▼            │
│  Build   │                     │ Push to OCIR      │
│ Docker   │                     │      │            │
│  Build   │                     │      ▼            │
└──────────┘                     │ ┌──────┬───────┐  │
                                 │ │Compute│  OKE  │  │
                                 │ │(SSH)  │ (k8s) │  │
                                 │ └──────┴───────┘  │
                                 └───────────────────┘
```

### 배포 대상 선택

GitHub Repository Variable `DEPLOY_TARGET`으로 제어:

| 값 | 대상 | 설명 |
|----|------|------|
| `compute` | OCI Compute | SSH 접속 → Docker Compose로 배포 |
| `oke` | OKE (Kubernetes) | kubectl apply로 K8s 배포 |

### 설정 방법

**1단계: OCI 사전 준비**

```bash
# Compute 배포 시: Docker가 설치된 OCI Compute 인스턴스 필요
# OKE 배포 시: OKE 클러스터 + OCIR imagePullSecret 생성 필요

# OCIR 리포지토리 생성 (OCI 콘솔 또는 CLI)
# - <namespace>/one-click-publishing/user-service
# - <namespace>/one-click-publishing/api-gateway
```

**2단계: GitHub Secrets 등록**

```bash
# .env.deploy 파일 생성 후 값 입력
cp .env.deploy.example .env.deploy
vi .env.deploy

# 자동 등록 스크립트 실행
bash scripts/setup-oci-secrets.sh
```

**필요한 Secrets/Variables:**

| 이름 | 유형 | 설명 |
|------|------|------|
| `OCI_REGION` | Variable | OCI 리전 (예: `ap-chuncheon-1`) |
| `OCIR_NAMESPACE` | Variable | Tenancy Object Storage namespace |
| `DEPLOY_TARGET` | Variable | `compute` 또는 `oke` |
| `OCI_USERNAME` | Secret | OCIR 로그인용 사용자명 |
| `OCI_AUTH_TOKEN` | Secret | OCI Auth Token |
| `OCI_COMPUTE_HOST` | Secret | Compute 공인 IP (compute 모드) |
| `OCI_COMPUTE_USER` | Secret | SSH 사용자명 (compute 모드) |
| `OCI_SSH_PRIVATE_KEY` | Secret | SSH 개인키 (compute 모드) |
| `OKE_CLUSTER_OCID` | Secret | OKE 클러스터 OCID (oke 모드) |

### OKE 배포 시 OCIR imagePullSecret 생성

```bash
kubectl create secret docker-registry ocir-secret \
  --docker-server=<region>.ocir.io \
  --docker-username='<namespace>/<username>' \
  --docker-password='<auth-token>' \
  --docker-email='<email>'
```

## 기술 스택

- **Protobuf**: 서비스 간 인터페이스 정의 (IDL)
- **gRPC**: 고성능 RPC 프레임워크
- **Python (grpcio)**: gRPC 서버 구현
- **NestJS 10**: TypeScript 기반 서버 프레임워크
- **@nestjs/microservices**: NestJS 내장 gRPC 클라이언트
- **class-validator / class-transformer**: DTO 기반 요청 유효성 검증
- **Docker Compose**: 멀티 컨테이너 오케스트레이션
- **GitHub Actions**: CI/CD 파이프라인
- **OCIR**: Oracle Cloud Container Registry
- **OCI Compute / OKE**: Oracle Cloud 배포 대상
