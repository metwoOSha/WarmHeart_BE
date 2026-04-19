import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function register(req: Request, res: Response) {
    try {
        const { email, password, name } = req.body;

        const existingUser = await prisma.users.findUnique({ where: { email } });

        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hash = await bcrypt.hash(password, 10);

        const user = await prisma.users.create({ data: { email, password: hash, name } });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

        res.status(201).json(token);
    } catch (error) {
        res.status(500).json({ message: `${error}` });
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        const user = await prisma.users.findUnique({ where: { email } });

        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

        res.status(200).json(token);
    } catch (error) {
        res.status(500).json({ message: `${error}` });
    }
}
