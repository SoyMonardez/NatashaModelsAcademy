import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getJwtSecret } from '../config/security';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;
  if (!authorization?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authorization.slice(7).trim();
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret(), {
      algorithms: ['HS256'],
    }) as { userId: string; role: string };

    if (!decoded.userId || !['USER', 'ADMIN'].includes(decoded.role)) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = { userId: decoded.userId, role: decoded.role };
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};


export const optionalAuthenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;
  if (!authorization) return next();
  if (!authorization.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  try {
    const decoded = jwt.verify(authorization.slice(7).trim(), getJwtSecret(), {
      algorithms: ['HS256'],
    }) as { userId: string; role: string };
    if (!decoded.userId || !['USER', 'ADMIN'].includes(decoded.role)) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    req.user = { userId: decoded.userId, role: decoded.role };
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
export const authorizeAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden: Admin access only' });
  }
  next();
};

