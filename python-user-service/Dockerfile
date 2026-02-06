FROM python:3.12-slim

WORKDIR /app

COPY python-user-service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY proto/user.proto ./proto/
COPY python-user-service/server.py .

RUN python -m grpc_tools.protoc \
    -I./proto \
    --python_out=. \
    --grpc_python_out=. \
    proto/user.proto

EXPOSE 50051

CMD ["python", "server.py"]
