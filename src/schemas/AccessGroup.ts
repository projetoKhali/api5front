import { Suggestion } from './Misc';

export interface AccessGroupSchema {
  id: number;
  name: string;
  departments: Suggestion[];
}

export interface CreateAccessGroupSchema {
  name: string;
  departments: number[];
}

export interface CreateAccessGroupResponse {
  id: number;
  name: string;
}

