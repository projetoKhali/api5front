import axios from 'axios';
import { getApiUrl } from '../Env';
import { CreateUserResponse, CreateUserSchema, UserSchema } from '../schemas/User';

export async function getGroupAccesses(
): Promise<UserSchema[]> {
  const response = await axios.get<UserSchema[]>(
    `${getApiUrl()}/api/v1/authentication/users`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data || [];
}

export async function getSuggestionsRecruiter(
    body: CreateUserSchema,
  ): Promise<CreateUserResponse> {
    const response = await axios.post<CreateUserResponse>(
      `${getApiUrl()}/api/v1/authentication/create`,
      body,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data || null;
  }