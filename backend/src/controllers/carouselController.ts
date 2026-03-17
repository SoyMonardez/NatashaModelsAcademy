import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCarouselItems = async (req: Request, res: Response) => {
  try {
    const items = await prisma.carouselItem.findMany();
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch carousel items' });
  }
};

export const createCarouselItem = async (req: Request, res: Response) => {
  try {
    const { title, imageUrl } = req.body;
    
    const newItem = await prisma.carouselItem.create({
      data: {
        title: title || '',
        imageUrl,
      }
    });

    res.status(201).json(newItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create carousel item' });
  }
};

export const deleteCarouselItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.carouselItem.delete({
      where: { id: String(id) }
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete carousel item' });
  }
};
