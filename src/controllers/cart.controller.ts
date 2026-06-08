import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export async function getCart(req: Request, res: Response) {
    try {
        const userId = req.user!.id;
        const cart = await prisma.cart.findFirst({
            where: { userId },
            include: {
                items: {
                    include: { blanket: true },
                },
            },
        });
        if (!cart) return res.status(404).json({ message: 'Not Found' });
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: `${error}` });
    }
}

export async function addItem(req: Request, res: Response) {
    try {
        const userId = req.user!.id;
        const { blanketId, quantity } = req.body;
        let cart = await prisma.cart.findFirst({ where: { userId } });
        if (!cart) {
            cart = await prisma.cart.create({ data: { userId } });
        }
        const existingItem = await prisma.cartItem.findFirst({
            where: { cartId: cart.id, blanketId },
        });
        if (existingItem) {
            await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity },
            });
        } else {
            await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    blanketId,
                    quantity,
                },
            });
        }

        res.status(200).json({ message: 'Item added to cart' });
    } catch (error) {
        res.status(500).json({ message: `${error}` });
    }
}

export async function removeItem(req: Request, res: Response) {
    try {
        const id = req.params.id as string;
        await prisma.cartItem.delete({ where: { id } });
        res.status(200).json({ message: 'Item removed' });
    } catch (error) {
        res.status(500).json({ message: `${error}` });
    }
}

export async function updateQuantity(req: Request, res: Response) {
    try {
        const id = req.params.id as string;
        const quantity = req.body.quantity;
        await prisma.cartItem.update({
            where: { id: id },
            data: { quantity },
        });
        res.status(200).json({ message: 'Item updated' });
    } catch (error) {
        res.status(500).json({ message: `${error}` });
    }
}
