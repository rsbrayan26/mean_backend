import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    export interface Request {
      session: {
        userId: string;
        email: string;
      };
    }
  }
}

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.headers;
    if (!token) throw { mesagge: 'missing header token' };
    const { userId, email } = jwt.verify(
      token as string,
      process.env.JWT_SECRET!,
    ) as any;
    req.session = { userId: userId, email: email };
    next();
  } catch (e) {
    res.status(401).send(e);
  }
};

export const checkIp = (req: Request, res: Response, next: NextFunction) => {
  try {
    const hostname = req.hostname;
    console.log(hostname);
    if (hostname === 'localhost') {
      next();
    } else {
      throw { mesagge: 'Access denied' };
    }
  } catch (e) {
    res.status(401).send(e);
  }
};
