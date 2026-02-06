import {
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  UserServiceGrpc,
  UserResponse,
  DeleteUserResponse,
} from './user-service.interface';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService implements OnModuleInit {
  private grpcService!: UserServiceGrpc;

  constructor(@Inject('USER_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.grpcService =
      this.client.getService<UserServiceGrpc>('UserService');
  }

  async createUser(dto: CreateUserDto): Promise<UserResponse> {
    return firstValueFrom(
      this.grpcService.createUser(dto).pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      ),
    );
  }

  async getUser(id: string): Promise<UserResponse> {
    try {
      return await firstValueFrom(this.grpcService.getUser({ id }));
    } catch (error: any) {
      if (error?.code === 5) {
        throw new NotFoundException('사용자를 찾을 수 없습니다');
      }
      throw error;
    }
  }

  async listUsers(): Promise<UserResponse[]> {
    const result = await firstValueFrom(
      this.grpcService.listUsers({} as Record<string, never>),
    );
    return result.users;
  }

  async deleteUser(id: string): Promise<DeleteUserResponse> {
    try {
      return await firstValueFrom(this.grpcService.deleteUser({ id }));
    } catch (error: any) {
      if (error?.code === 5) {
        throw new NotFoundException('사용자를 찾을 수 없습니다');
      }
      throw error;
    }
  }
}
