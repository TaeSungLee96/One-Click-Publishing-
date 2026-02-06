import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const userGrpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'user',
    protoPath: join(__dirname, '..', '..', 'proto', 'user.proto'),
    url: process.env.USER_SERVICE_HOST || 'localhost:50051',
  },
};
