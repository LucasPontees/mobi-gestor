// http/api.ts
import ky from 'ky';

export const api = ky.create({
  prefixUrl: 'http://localhost:3333', // backend
  hooks: {
    beforeRequest: [
      request => {
        const token = localStorage.getItem('token');
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      }
    ]
  }
});

export interface LoginData {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  access_token: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

export const auth = {
  login: (data: LoginData) =>
    api.post('auth/login', { json: data }).json<LoginResponse>(),
  register: (data: RegisterData) => 
    api.post('auth/register', { json: data }).json<RegisterResponse>(),
};
