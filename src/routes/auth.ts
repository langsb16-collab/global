// Authentication Routes

import { Hono } from 'hono';
import { generateToken, hashPassword, verifyPassword } from '../utils/jwt';
import type { Env, User, APIResponse } from '../types';

const auth = new Hono<{ Bindings: Env }>();

// Register new user
auth.post('/register', async (c) => {
  try {
    const { email, password, name, role, phone, business_name, business_number, address } = await c.req.json();

    if (!email || !password || !name) {
      return c.json<APIResponse>({ 
        success: false, 
        error: 'Email, password, and name are required' 
      }, 400);
    }

    // Check if user already exists
    const existing = await c.env.DB.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).bind(email).first();

    if (existing) {
      return c.json<APIResponse>({ 
        success: false, 
        error: 'Email already registered' 
      }, 400);
    }

    // Hash password
    const password_hash = await hashPassword(password);

    // Insert user
    const result = await c.env.DB.prepare(`
      INSERT INTO users (email, password_hash, name, role, phone, business_name, business_number, address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      email,
      password_hash,
      name,
      role || 'farmer',
      phone || null,
      business_name || null,
      business_number || null,
      address || null
    ).run();

    if (!result.success) {
      return c.json<APIResponse>({ 
        success: false, 
        error: 'Failed to create user' 
      }, 500);
    }

    // Generate token
    const token = await generateToken({
      userId: result.meta.last_row_id as number,
      email,
      role: role || 'farmer'
    });

    return c.json<APIResponse>({
      success: true,
      data: { token, userId: result.meta.last_row_id },
      message: 'User registered successfully'
    }, 201);

  } catch (error) {
    console.error('Register error:', error);
    return c.json<APIResponse>({ 
      success: false, 
      error: 'Internal server error' 
    }, 500);
  }
});

// Login
auth.post('/login', async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json<APIResponse>({ 
        success: false, 
        error: 'Email and password are required' 
      }, 400);
    }

    // Find user
    const user = await c.env.DB.prepare(
      'SELECT id, email, password_hash, name, role, is_active FROM users WHERE email = ?'
    ).bind(email).first<User>();

    if (!user) {
      return c.json<APIResponse>({ 
        success: false, 
        error: 'Invalid credentials' 
      }, 401);
    }

    // Check if user is active
    if (user.is_active !== 1) {
      return c.json<APIResponse>({ 
        success: false, 
        error: 'Account is inactive' 
      }, 403);
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password_hash);

    if (!isValid) {
      return c.json<APIResponse>({ 
        success: false, 
        error: 'Invalid credentials' 
      }, 401);
    }

    // Generate token
    const token = await generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    return c.json<APIResponse>({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      },
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    return c.json<APIResponse>({ 
      success: false, 
      error: 'Internal server error' 
    }, 500);
  }
});

// Get current user profile
auth.get('/me', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json<APIResponse>({ 
        success: false, 
        error: 'Unauthorized' 
      }, 401);
    }

    const token = authHeader.substring(7);
    const { verifyToken } = await import('../utils/jwt');
    const payload = await verifyToken(token);

    if (!payload) {
      return c.json<APIResponse>({ 
        success: false, 
        error: 'Invalid token' 
      }, 401);
    }

    // Get user details
    const user = await c.env.DB.prepare(`
      SELECT id, email, name, role, phone, business_name, business_number, address, created_at
      FROM users WHERE id = ?
    `).bind(payload.userId).first<User>();

    if (!user) {
      return c.json<APIResponse>({ 
        success: false, 
        error: 'User not found' 
      }, 404);
    }

    return c.json<APIResponse>({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Get profile error:', error);
    return c.json<APIResponse>({ 
      success: false, 
      error: 'Internal server error' 
    }, 500);
  }
});

export default auth;
