import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    
    if (!token) {
       res.status(400).json({ error: 'Token is required' });
       return;
    }

    let payload;
    try {
      // Intentar como ID Token primero
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (e) {
      // Si falla, intentar obtener info usando el Access Token directamente
      const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (googleRes.ok) {
        payload = await googleRes.json();
      }
    }

    if (!payload) {
        res.status(400).json({ error: 'Invalid Google token' });
        return;
    }

    const { email, name, sub: googleId, picture } = payload as any;

    if (!email) {
      res.status(400).json({ error: 'Email not provided by Google' });
      return;
    }

    // Check if user exists in our DB
    let user = await prisma.user.findUnique({
      where: { email: email }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: email,
          name: name || '',
          googleId: googleId,
          role: 'USER',
        }
      });
    } else if (!user.googleId) {
       // Vincular cuenta si el email coincide pero no tenía Google ID
       user = await prisma.user.update({
         where: { id: user.id },
         data: { googleId: googleId }
       });
    }

    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret';
    const authToken = jwt.sign(
      { userId: user.id, role: user.role },
      jwtSecret,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token: authToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        picture: picture // Devolvemos la foto de Google para el frontend
      }
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret';
    const token = jwt.sign({ userId: user.id, role: user.role }, jwtSecret, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'USER'
      }
    });

    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret';
    const token = jwt.sign({ userId: user.id, role: user.role }, jwtSecret, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};
