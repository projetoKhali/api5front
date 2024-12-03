import {
  CreateUserResponse,
  CreateUserSchema,
  UserSchema,
} from '../schemas/User';
import { processRequest } from './base';

export async function getUsers(): Promise<UserSchema[]> {
  return processRequest<never, UserSchema[]>('get', 'authentication/users');
}

export async function createUser(
  body: CreateUserSchema,
): Promise<CreateUserResponse> {
  return processRequest<CreateUserSchema, CreateUserResponse>(
    'post',
    'authentication/create',
    body,
  );
}
