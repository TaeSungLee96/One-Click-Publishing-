const express = require("express");
const grpcClient = require("./grpcClient");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 사용자 생성
app.post("/api/users", async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "name과 email은 필수입니다" });
    }
    const user = await grpcClient.createUser({ name, email });
    res.status(201).json(user);
  } catch (error) {
    console.error("[POST /api/users] 오류:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// 사용자 조회
app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await grpcClient.getUser({ id: req.params.id });
    res.json(user);
  } catch (error) {
    if (error.code === 5) {
      return res.status(404).json({ error: "사용자를 찾을 수 없습니다" });
    }
    console.error("[GET /api/users/:id] 오류:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// 전체 사용자 목록 조회
app.get("/api/users", async (req, res) => {
  try {
    const result = await grpcClient.listUsers({});
    res.json(result.users);
  } catch (error) {
    console.error("[GET /api/users] 오류:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// 사용자 삭제
app.delete("/api/users/:id", async (req, res) => {
  try {
    const result = await grpcClient.deleteUser({ id: req.params.id });
    res.json(result);
  } catch (error) {
    if (error.code === 5) {
      return res.status(404).json({ error: "사용자를 찾을 수 없습니다" });
    }
    console.error("[DELETE /api/users/:id] 오류:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// 헬스체크
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "api-gateway" });
});

app.listen(PORT, () => {
  console.log(`Node.js API Gateway가 포트 ${PORT}에서 시작되었습니다.`);
  console.log(`gRPC 대상: ${process.env.USER_SERVICE_HOST || "localhost:50051"}`);
});
