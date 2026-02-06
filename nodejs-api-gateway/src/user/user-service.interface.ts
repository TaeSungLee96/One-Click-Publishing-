import { Observable } from 'rxjs';

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface ListUsersResponse {
  users: UserResponse[];
}

export interface DeleteUserResponse {
  success: boolean;
  message: string;
}

export interface UserServiceGrpc {
  createUser(data: { name: string; email: string }): Observable<UserResponse>;
  getUser(data: { id: string }): Observable<UserResponse>;
  listUsers(data: Record<string, never>): Observable<ListUsersResponse>;
  deleteUser(data: { id: string }): Observable<DeleteUserResponse>;
}
