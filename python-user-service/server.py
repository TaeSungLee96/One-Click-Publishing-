import grpc
from concurrent import futures
import uuid
from datetime import datetime, timezone

import user_pb2
import user_pb2_grpc

# 인메모리 사용자 저장소
users_db: dict[str, dict] = {}


class UserServiceServicer(user_pb2_grpc.UserServiceServicer):
    """사용자 관리 gRPC 서비스 구현"""

    def CreateUser(self, request, context):
        user_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc).isoformat()

        user = {
            "id": user_id,
            "name": request.name,
            "email": request.email,
            "created_at": now,
        }
        users_db[user_id] = user

        print(f"[CreateUser] 사용자 생성: {user_id} ({request.name})")
        return user_pb2.UserResponse(
            id=user_id,
            name=request.name,
            email=request.email,
            created_at=now,
        )

    def GetUser(self, request, context):
        user = users_db.get(request.id)
        if not user:
            context.set_code(grpc.StatusCode.NOT_FOUND)
            context.set_details(f"사용자를 찾을 수 없습니다: {request.id}")
            return user_pb2.UserResponse()

        print(f"[GetUser] 사용자 조회: {request.id}")
        return user_pb2.UserResponse(
            id=user["id"],
            name=user["name"],
            email=user["email"],
            created_at=user["created_at"],
        )

    def ListUsers(self, request, context):
        print(f"[ListUsers] 전체 사용자 목록 조회 (총 {len(users_db)}명)")
        user_responses = [
            user_pb2.UserResponse(
                id=u["id"],
                name=u["name"],
                email=u["email"],
                created_at=u["created_at"],
            )
            for u in users_db.values()
        ]
        return user_pb2.ListUsersResponse(users=user_responses)

    def DeleteUser(self, request, context):
        if request.id not in users_db:
            context.set_code(grpc.StatusCode.NOT_FOUND)
            context.set_details(f"사용자를 찾을 수 없습니다: {request.id}")
            return user_pb2.DeleteUserResponse(
                success=False, message="사용자를 찾을 수 없습니다"
            )

        del users_db[request.id]
        print(f"[DeleteUser] 사용자 삭제: {request.id}")
        return user_pb2.DeleteUserResponse(
            success=True, message="사용자가 삭제되었습니다"
        )


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    user_pb2_grpc.add_UserServiceServicer_to_server(UserServiceServicer(), server)
    server.add_insecure_port("[::]:50051")
    server.start()
    print("Python User Service가 포트 50051에서 시작되었습니다.")
    server.wait_for_termination()


if __name__ == "__main__":
    serve()
