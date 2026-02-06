# gRPC MSA Example: Python + Node.js

Python 서비스와 Node.js 서비스가 gRPC로 통신하는 마이크로서비스 아키텍처(MSA) 예제입니다.

## 아키텍처

```
┌─────────────────────┐     gRPC (protobuf)     ┌─────────────────────┐
│  Node.js API Gateway│ ──────────────────────▶  │  Python User Service│
│  (REST API :3000)   │                          │  (gRPC Server :50051│)
│                     │ ◀──────────────────────  │                     │
│  - Express          │                          │  - grpcio           │
│  - @grpc/grpc-js    │                          │  - 인메모리 DB       │
└─────────────────────┘                          └─────────────────────┘
        ▲
        │ HTTP REST
        │
   클라이언트 (curl, 브라우저 등)
```

### 서비스 구성

| 서비스 | 언어 | 역할 | 포트 |
|--------|------|------|------|
| `user-service` | Python 3.12 | 사용자 CRUD gRPC 서버 | 50051 |
| `api-gateway` | Node.js 20 | REST → gRPC 변환 게이트웨이 | 3000 |

### 통신 흐름

1. 클라이언트가 `api-gateway`에 REST 요청 전송
2. `api-gateway`가 요청을 gRPC 호출로 변환하여 `user-service`에 전달
3. `user-service`가 처리 후 gRPC 응답 반환
4. `api-gateway`가 응답을 JSON으로 변환하여 클라이언트에 전달

## 프로젝트 구조

```
├── proto/                        # 공유 Protobuf 정의
│   └── user.proto
├── python-user-service/          # Python gRPC 서버
│   ├── server.py
│   ├── requirements.txt
│   └── Dockerfile
├── nodejs-api-gateway/           # Node.js REST API 게이트웨이
│   ├── src/
│   │   ├── index.js              # Express 서버 + REST 라우트
│   │   └── grpcClient.js         # gRPC 클라이언트 래퍼
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml            # 서비스 오케스트레이션
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

**2. Node.js API Gateway**

```bash
cd nodejs-api-gateway
npm install

# proto 파일을 로컬에 복사 (grpc-js가 런타임에 로드)
mkdir -p proto && cp ../proto/user.proto proto/

npm start
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

## 기술 스택

- **Protobuf**: 서비스 간 인터페이스 정의 (IDL)
- **gRPC**: 고성능 RPC 프레임워크
- **Python (grpcio)**: gRPC 서버 구현
- **Node.js (@grpc/grpc-js)**: gRPC 클라이언트 + Express REST API
- **Docker Compose**: 멀티 컨테이너 오케스트레이션
