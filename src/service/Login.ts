import axios from 'axios';
import { LoginRequest, LoginResponse } from '../schemas/Login';
import { getApiUrl } from '../Env';

export async function postLogin(payload: LoginRequest): Promise<LoginResponse> {
  const response = await axios.post<LoginResponse>(
    `${getApiUrl()}/api/v1/authentication/login`,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
}
