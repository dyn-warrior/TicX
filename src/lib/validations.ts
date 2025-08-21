import { z } from 'zod';

// Auth schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9._-]+$/, 'Username can only contain letters, numbers, periods, underscores, and hyphens'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be less than 100 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Game schemas
export const joinQueueSchema = z.object({
  baseEntry: z.number().int().positive().min(10).max(1000),
  leverage: z.number().int().min(1).max(5),
});

export const moveSchema = z.object({
  index0to8: z.number().int().min(0).max(8),
});

export const matchIdSchema = z.object({
  matchId: z.string().cuid(),
});

// Wallet schemas
export const depositSchema = z.object({
  amount: z.number().int().positive().min(10).max(10000),
});

export const withdrawSchema = z.object({
  amount: z.number().int().positive(),
});

// Admin schemas
export const banUserSchema = z.object({
  userId: z.string().cuid(),
  banned: z.boolean(),
  reason: z.string().optional(),
});

export const refundMatchSchema = z.object({
  matchId: z.string().cuid(),
  reason: z.string().min(1, 'Reason is required'),
});

// Environment schema
export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().url(),
  REDIS_URL: z.string().url().optional(),
  REDIS_TOKEN: z.string().optional(),
  DRAW_REFUND: z.enum(['full', 'none']).default('full'),
  TURN_MS: z.coerce.number().positive().default(20000),
  RESTRICTED_STATES: z.string().default(''),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

// API Response schemas
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

export const userProfileSchema = z.object({
  id: z.string(),
  email: z.string(),
  username: z.string(),
  rating: z.number(),
  createdAt: z.date(),
  wallet: z.object({
    balance: z.number(),
    locked: z.number(),
  }),
});

export const matchStateSchema = z.object({
  id: z.string(),
  status: z.enum(['WAITING', 'ACTIVE', 'COMPLETED', 'CANCELLED']),
  board: z.string().length(9),
  turn: z.enum(['X', 'O']),
  entryFinalE: z.number(),
  leverage: z.number(),
  participants: z.array(z.object({
    id: z.string(),
    userId: z.string(),
    symbol: z.enum(['X', 'O']),
    user: z.object({
      username: z.string(),
      rating: z.number(),
    }),
  })),
  moves: z.array(z.object({
    id: z.string(),
    index0to8: z.number(),
    symbol: z.enum(['X', 'O']),
    moveNo: z.number(),
    createdAt: z.date(),
    userId: z.string(),
  })),
  winnerId: z.string().optional(),
  reason: z.enum(['WIN', 'LOSS', 'DRAW', 'FORFEIT', 'CANCELLED']).optional(),
  createdAt: z.date(),
  startedAt: z.date().optional(),
  endedAt: z.date().optional(),
});

// Socket.IO event schemas
export const socketMoveSchema = z.object({
  matchId: z.string().cuid(),
  index0to8: z.number().int().min(0).max(8),
});

export const socketJoinRoomSchema = z.object({
  matchId: z.string().cuid(),
});

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type JoinQueueInput = z.infer<typeof joinQueueSchema>;
export type MoveInput = z.infer<typeof moveSchema>;
export type DepositInput = z.infer<typeof depositSchema>;
export type WithdrawInput = z.infer<typeof withdrawSchema>;
export type BanUserInput = z.infer<typeof banUserSchema>;
export type RefundMatchInput = z.infer<typeof refundMatchSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
export type MatchState = z.infer<typeof matchStateSchema>;
export type SocketMoveInput = z.infer<typeof socketMoveSchema>;
export type SocketJoinRoomInput = z.infer<typeof socketJoinRoomSchema>;

// Validation helper
export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`Validation failed: ${result.error.message}`);
  }
  return result.data;
}
