// Authentication Middleware

import { Context, Next } from 'hono';
import { verifyToken } from '../utils/jwt';
import type { Env, JWTPayload } from '../types';

export async function authMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, error: 'Unauthorized: No token provided' }, 401);
  }

  const token = authHeader.substring(7);
  const payload = await verifyToken(token);

  if (!payload) {
    return c.json({ success: false, error: 'Unauthorized: Invalid token' }, 401);
  }

  // Attach user info to context
  c.set('user', payload);

  await next();
}

export async function adminMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
  const user = c.get('user') as JWTPayload;

  if (!user || user.role !== 'admin') {
    return c.json({ success: false, error: 'Forbidden: Admin access required' }, 403);
  }

  await next();
}
