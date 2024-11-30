import { LoginRequest, LoginResponse } from '../schemas/Login';
import { processRequest } from './base';

export async function postLogin(payload: LoginRequest): Promise<LoginResponse> {
  return processRequest<LoginRequest, LoginResponse>(
    'authentication/login',
    payload,
  );
}
