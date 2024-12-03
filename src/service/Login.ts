import { LoginRequest, LoginResponse } from '../schemas/Login';
import { processRequest } from './base';

export async function postLogin(body: LoginRequest): Promise<LoginResponse> {
  return processRequest<LoginRequest, LoginResponse>(
    'post',
    'authentication/login',
    body,
  );
}
