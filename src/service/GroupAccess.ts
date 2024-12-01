import axios from 'axios';
import { getApiUrl } from '../Env';
import { GroupAccessSchema, CreateGroupAccessResponse, CreateGroupAccessSchema } from '../schemas/GroupAccess';

export async function getGroupAccesses(
): Promise<GroupAccessSchema[]> {
  const response = await axios.get<GroupAccessSchema[]>(
    `${getApiUrl()}/api/v1/group-access`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data || [];
}

export async function createGroupAccess(
    body: CreateGroupAccessSchema,
  ): Promise<CreateGroupAccessResponse> {
    const response = await axios.post<CreateGroupAccessResponse>(
      `${getApiUrl()}/api/v1/group-access`,
      body,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data || null;
  }