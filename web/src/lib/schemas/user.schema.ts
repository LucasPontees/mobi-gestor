import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  role: z.enum(['ADMIN', 'USER'], {
    errorMap: () => ({ message: 'Tipo de usuário inválido' })
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const userResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['ADMIN', 'USER']),
  createdAt: z.string().datetime(),
});

export type User = z.infer<typeof userResponseSchema>; 