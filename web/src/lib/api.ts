import ky from 'ky';
import { z } from 'zod';
import { createUserSchema, userResponseSchema, type CreateUserInput } from './schemas/user.schema';

// Schemas de validação
export const LoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['ADMIN', 'USER']),
});

export type User = z.infer<typeof UserSchema>;

// Configuração base do cliente HTTP
const api = ky.create({
  prefixUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  hooks: {
    beforeRequest: [
      request => {
        const token = localStorage.getItem('@bet300:token');
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      }
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401) {
          localStorage.removeItem('@bet300:token');
          window.location.href = '/login';
        }
        return response;
      }
    ]
  }
});

// Funções de API tipadas com Zod
export const apiClient = {
  auth: {
    login: async (data: LoginInput) => {
      const validated = LoginSchema.parse(data);
      const response = await api.post('auth/login', { json: validated }).json();
      return response;
    },
    me: async () => {
      const response = await api.get('auth/me').json();
      return userResponseSchema.parse(response);
    }
  },
  users: {
    create: async (data: CreateUserInput) => {
      const validated = createUserSchema.parse(data);
      const response = await api.post('users', { json: validated }).json();
      return userResponseSchema.parse(response);
    },
    list: async () => {
      const response = await api.get('users').json();
      return z.array(userResponseSchema).parse(response);
    },
    delete: async (id: string) => {
      await api.delete(`users/${id}`);
    }
  }
}; 