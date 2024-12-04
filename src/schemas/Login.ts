export interface LoginRequest {
  email: string;
  password: string;
}

export interface Department {
  id: number;
  title: string;
}

export interface User {
  name: string;
  email: string;
  group: string;
  departments: Department[];
}

export interface LoginResponse {
  message: string;
  user: User;
}
