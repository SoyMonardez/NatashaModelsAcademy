import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { sendEmail } from '../services/emailService';
import { getJwtSecret } from '../config/security';

const prisma = new PrismaClient();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const issueToken = (userId: string, role: string) => jwt.sign(
  { userId, role },
  getJwtSecret(),
  { algorithm: 'HS256', expiresIn: '2h' },
);

const isSafePictureUrl = (value: unknown): value is string => {
  if (typeof value !== 'string' || value.length > 2048) return false;
  if (value.startsWith('/uploads/')) return true;
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (typeof token !== 'string' || token.length < 20 || token.length > 4096) {
      return res.status(400).json({ error: 'Invalid Google token' });
    }

    let payload: any;
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch {
      const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(5000),
      });
      if (googleRes.ok) payload = await googleRes.json();
    }

    const email = typeof payload?.email === 'string' ? payload.email.trim().toLowerCase() : '';
    const emailVerified = payload?.email_verified ?? payload?.verified_email;
    if (!email || email.length > 254 || emailVerified !== true) {
      return res.status(401).json({ error: 'Verified Google email required' });
    }

    const name = typeof payload.name === 'string' ? payload.name.slice(0, 100) : '';
    const googleId = typeof payload.sub === 'string' ? payload.sub.slice(0, 255) : undefined;
    const picture = isSafePictureUrl(payload.picture) ? payload.picture : undefined;

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: { email, name, googleId, picture, role: 'USER' },
      });
    } else if (!user.googleId && googleId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId },
      });
    }

    res.json({
      message: 'Login successful',
      token: issueToken(user.id, user.role),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        picture: user.picture || picture,
        phone: user.phone,
        location: user.location,
      },
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (typeof email !== 'string' || typeof password !== 'string' || email.length > 254 || password.length > 128) {
      return res.status(400).json({ error: 'Invalid login data' });
    }

    const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
    if (!user?.password || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({
      token: issueToken(user.id, user.role),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        picture: user.picture,
        phone: user.phone,
        location: user.location,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    if (typeof email !== 'string' || typeof password !== 'string' || typeof name !== 'string' ||
        email.length > 254 || name.trim().length < 1 || name.length > 100) {
      return res.status(400).json({ error: 'Completá un nombre y un email válidos.' });
    }
    if (password.length < 12 || password.length > 128) {
      return res.status(400).json({ error: 'La contraseña debe tener entre 12 y 128 caracteres.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({ error: 'Completá un nombre y un email válidos.' });
    }

    if (await prisma.user.findUnique({ where: { email: normalizedEmail } })) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: await bcrypt.hash(password, 12),
        name: name.trim(),
        role: 'USER',
      },
    });

    res.status(201).json({
      token: issueToken(user.id, user.role),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        picture: user.picture,
        phone: user.phone,
        location: user.location,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

const PASSWORD_RESET_TTL_MS = 30 * 60 * 1000;
const RESET_REQUEST_MESSAGE = 'If the account is eligible, you will receive an email with instructions shortly.';

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const passwordResetUrl = (token: string): string => {
  const configuredUrl = process.env.PASSWORD_RESET_URL;
  if (!configuredUrl) throw new Error('PASSWORD_RESET_URL is not configured');

  const url = new URL(configuredUrl);
  if (process.env.NODE_ENV === 'production' && url.protocol !== 'https:') {
    throw new Error('PASSWORD_RESET_URL must use HTTPS in production');
  }
  url.searchParams.set('token', token);
  return url.toString();
};

export const requestPasswordReset = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (typeof email !== 'string' || email.length > 254 || !isValidEmail(email.trim().toLowerCase())) {
    return res.status(400).json({ message: RESET_REQUEST_MESSAGE });
  }

  try {
    const user = await prisma.user.findFirst({
      where: { email: email.trim().toLowerCase(), role: 'USER', password: { not: null } },
      select: { id: true, email: true, name: true },
    });

    if (user) {
      const rawToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
      const expiresAt = new Date(Date.now() + PASSWORD_RESET_TTL_MS);
      await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
      await prisma.passwordResetToken.create({ data: { userId: user.id, tokenHash, expiresAt } });

      const resetLink = passwordResetUrl(rawToken);
      const recipient = 'usuario';
      const emailHtml =
        '<!doctype html><html lang="es"><body style="margin:0;background:#f3f0eb;color:#171717;font-family:Arial,Helvetica,sans-serif">' +
        '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f0eb;padding:32px 12px"><tr><td align="center">' +
        '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border:1px solid #e5dfd6">' +
        '<tr><td style="background:#111111;padding:28px 36px;text-align:center;color:#ffffff">' +
        '<div style="font-family:Georgia,serif;font-size:27px;letter-spacing:2px">NATASHA</div><div style="font-size:10px;letter-spacing:4px;color:#d9c7a1;margin-top:6px">MODELS ACADEMY</div>' +
        '</td></tr><tr><td style="padding:42px 42px 32px">' +
        '<div style="font-size:10px;letter-spacing:2px;font-weight:bold;color:#a18452;margin-bottom:18px">SEGURIDAD DE CUENTA</div>' +
        '<h1 style="font-family:Georgia,serif;font-size:31px;line-height:1.15;font-weight:normal;margin:0 0 18px">Recuperá tu contraseña</h1>' +
        '<p style="font-size:16px;line-height:1.6;margin:0 0 18px;color:#4a4a4a">Recibimos una solicitud para crear una nueva contraseña para tu cuenta.</p>' +
        '<p style="font-size:16px;line-height:1.6;margin:0;color:#4a4a4a">Usá el botón de abajo dentro de los próximos <strong>30 minutos</strong>.</p>' +
        '<table role="presentation" cellspacing="0" cellpadding="0" style="margin:30px 0 26px"><tr><td style="background:#111111"><a href="' + resetLink + '" style="display:inline-block;padding:16px 26px;color:#ffffff;text-decoration:none;font-size:12px;font-weight:bold;letter-spacing:1.5px">RECUPERAR CONTRASEÑA</a></td></tr></table>' +
        '<p style="font-size:13px;line-height:1.6;color:#777;margin:0 0 18px">El enlace es de un solo uso. Si no pediste este cambio, podés ignorar este correo.</p>' +
        '<div style="border-top:1px solid #e9e4dc;padding-top:18px"><p style="font-size:12px;line-height:1.5;color:#888;margin:0 0 8px">Si el botón no funciona, copiá y pegá este enlace:</p><p style="font-size:11px;line-height:1.5;word-break:break-all;color:#8a6d3b;margin:0">' + resetLink + '</p></div>' +
        '</td></tr><tr><td style="background:#f8f6f2;padding:20px 36px;text-align:center;color:#888;font-size:11px;line-height:1.5">Natasha Models Academy · San Juan, Argentina<br>Este mensaje fue enviado automáticamente.</td></tr>' +
        '</table></td></tr></table></body></html>';

      const result = await sendEmail(
        user.email,
        'Restablecé tu contraseña | Natasha Models Academy',
        'Recibimos una solicitud para cambiar tu contraseña. Abrí este enlace dentro de los próximos 30 minutos: ' + resetLink + '. Si no solicitaste este cambio, ignorá este correo.',
        emailHtml,
      );

      if (!result.success) {
        await prisma.passwordResetToken.deleteMany({ where: { userId: user.id, tokenHash } });
        console.error('Password reset email could not be sent');
      }
    }
  } catch (error) {
    console.error('Password reset request failed:', error);
  }

  return res.status(200).json({ message: RESET_REQUEST_MESSAGE });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, password } = req.body;
  if (typeof token !== 'string' || !/^[a-f0-9]{64}$/i.test(token) ||
      typeof password !== 'string' || password.length < 12 || password.length > 128) {
    return res.status(400).json({ error: 'The reset link or password is invalid.' });
  }

  try {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const changed = await prisma.$transaction(async (tx) => {
      const record = await tx.passwordResetToken.findFirst({
        where: { tokenHash, usedAt: null, expiresAt: { gt: new Date() }, user: { is: { role: 'USER' } } },
        select: { id: true, userId: true },
      });
      if (!record) return false;

      const claimed = await tx.passwordResetToken.updateMany({
        where: { id: record.id, usedAt: null, expiresAt: { gt: new Date() } },
        data: { usedAt: new Date() },
      });
      if (claimed.count !== 1) return false;

      await tx.user.update({ where: { id: record.userId }, data: { password: await bcrypt.hash(password, 12) } });
      await tx.passwordResetToken.deleteMany({ where: { userId: record.userId } });
      return true;
    });

    if (!changed) return res.status(400).json({ error: 'The reset link is invalid or has expired.' });
    return res.status(200).json({ message: 'Your password was updated. You can now sign in.' });
  } catch (error) {
    console.error('Password reset confirmation failed:', error);
    return res.status(500).json({ error: 'Unable to reset the password.' });
  }
};
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = (req as any).user;
    const { name, phone, location, picture } = req.body;
    if ((name != null && (typeof name !== 'string' || name.length > 100)) ||
        (phone != null && (typeof phone !== 'string' || phone.length > 30)) ||
        (location != null && (typeof location !== 'string' || location.length > 150)) ||
        (picture != null && !isSafePictureUrl(picture))) {
      return res.status(400).json({ error: 'Invalid profile data' });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: typeof name === 'string' ? name.trim() : undefined,
        phone: typeof phone === 'string' ? phone.trim() : undefined,
        location: typeof location === 'string' ? location.trim() : undefined,
        picture: picture ?? undefined,
      },
    });

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        picture: user.picture,
        phone: user.phone,
        location: user.location,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};
