import {
  AccessGroupSchema,
  CreateAccessGroupResponse,
  CreateAccessGroupSchema,
} from '../schemas/AccessGroup';
import { processRequest } from './base';

export async function getAccessGroupes(): Promise<AccessGroupSchema[]> {
  return processRequest<never, AccessGroupSchema[]>('get', 'access-group');
}

export async function createAccessGroup(
  body: CreateAccessGroupSchema,
): Promise<CreateAccessGroupResponse> {
  return processRequest<CreateAccessGroupSchema, CreateAccessGroupResponse>(
    'post',
    'access-group',
    body,
  );
}
