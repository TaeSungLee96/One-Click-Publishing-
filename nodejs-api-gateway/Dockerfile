FROM node:20-slim

WORKDIR /app

# 의존성 설치
COPY nodejs-api-gateway/package.json nodejs-api-gateway/package-lock.json* ./
RUN npm install

# TypeScript 설정 및 소스 복사
COPY nodejs-api-gateway/tsconfig.json nodejs-api-gateway/nest-cli.json ./
COPY nodejs-api-gateway/src/ ./src/

# proto 파일 복사
COPY proto/user.proto ./proto/

# TypeScript 빌드
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main"]
