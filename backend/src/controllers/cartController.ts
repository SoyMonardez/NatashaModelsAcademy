import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

// Get user cart
export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'No autorizado' });

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        model: {
          include: { images: true }
        }
      }
    });

    res.json(cartItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
};

// Add to cart
export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { modelId } = req.body;

    if (!userId) return res.status(401).json({ error: 'No autorizado' });
    if (!modelId) return res.status(400).json({ error: 'ID de modelo requerido' });

    const cartItem = await prisma.cartItem.upsert({
      where: {
        userId_modelId: { userId, modelId }
      },
      update: {}, // No change if already exists
      create: { userId, modelId }
    });

    res.status(201).json(cartItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al añadir al carrito' });
  }
};

// Remove from cart
export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const modelId = req.params.modelId as string;

    if (!userId) return res.status(401).json({ error: 'No autorizado' });

    await prisma.cartItem.delete({
      where: {
        userId_modelId: { userId, modelId }
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar del carrito' });
  }
};

// Clear cart
export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'No autorizado' });

    await prisma.cartItem.deleteMany({
      where: { userId }
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al vaciar el carrito' });
  }
};
