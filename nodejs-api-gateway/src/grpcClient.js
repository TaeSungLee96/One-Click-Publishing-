const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const PROTO_PATH = path.join(__dirname, "..", "proto", "user.proto");
const USER_SERVICE_HOST = process.env.USER_SERVICE_HOST || "localhost:50051";

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const userProto = grpc.loadPackageDefinition(packageDefinition).user;

const client = new userProto.UserService(
  USER_SERVICE_HOST,
  grpc.credentials.createInsecure()
);

// Promise 래퍼: 콜백 기반 gRPC 호출을 Promise로 변환
function promisify(method) {
  return (request) =>
    new Promise((resolve, reject) => {
      method.call(client, request, (error, response) => {
        if (error) reject(error);
        else resolve(response);
      });
    });
}

module.exports = {
  createUser: promisify(client.CreateUser),
  getUser: promisify(client.GetUser),
  listUsers: promisify(client.ListUsers),
  deleteUser: promisify(client.DeleteUser),
};
