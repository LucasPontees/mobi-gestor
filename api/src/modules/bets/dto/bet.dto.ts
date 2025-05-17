import { z } from 'zod';

export const createBetSchema = z.object({
  team1: z.string().min(1, 'Time 1 é obrigatório'),
  team2: z.string().min(1, 'Time 2 é obrigatório'),
  betType: z.string().min(1, 'Tipo de aposta é obrigatório'),
  amount: z.number().positive('Valor deve ser positivo'),
  odds: z.number().min(1, 'Odds deve ser maior que 1'),
  result: z.enum(['green', 'red', 'pending']).default('pending'),
  profit: z.number().optional(),
  bankBeforeBet: z.number(),
});

export type CreateBetDto = z.infer<typeof createBetSchema>;

export const updateBetResultSchema = z.object({
  result: z.enum(['green', 'red']),
  profit: z.number().optional(),
});

export type UpdateBetResultDto = z.infer<typeof updateBetResultSchema>; 