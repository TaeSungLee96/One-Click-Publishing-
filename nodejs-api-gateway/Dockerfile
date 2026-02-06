FROM node:20-slim

WORKDIR /app

COPY nodejs-api-gateway/package.json .
RUN npm install --production

COPY proto/user.proto ./proto/
COPY nodejs-api-gateway/src/ ./src/

EXPOSE 3000

CMD ["node", "src/index.js"]
