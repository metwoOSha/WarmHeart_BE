import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.cookies?.token ?? req.headers.authorization?.split(' ')[1];

        if (!token) return res.status(401).json({ message: 'Unauthorized' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

        const user = await prisma.users.findUnique({
            where: { id: decoded.userId },
            select: { id: true, name: true, email: true },
        });

        if (!user) return res.status(401).json({ message: 'Unauthorized' });

        req.user = user;
        next();
    } catch {
        res.status(401).json({ message: 'Invalid token' });
    }
}
