import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export async function getBlankets(req: Request, res: Response) {
    try {
        const items = await prisma.blankets.findMany();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: `Server error: ${error}` });
    }
}

export async function getBlanketById(req: Request, res: Response) {
    try {
        const id = req.params.id as string;
        const item = await prisma.blankets.findUnique({ where: { id } });
        if (!item) return res.status(404).json({ message: 'Not found' });
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: `${error}` });
    }
}
