import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const isSafeImageUrl = (value: unknown): value is string => {
  if (typeof value !== 'string' || value.length > 2048) return false;
  if (value.startsWith('/uploads/')) return true;
  try { return new URL(value).protocol === 'https:'; } catch { return false; }
};

export const getCarouselItems = async (_req: Request, res: Response) => {
  try { res.json(await prisma.carouselItem.findMany()); }
  catch (error) { console.error(error); res.status(500).json({ error: 'Failed to fetch carousel items' }); }
};

export const createCarouselItem = async (req: Request, res: Response) => {
  try {
    const { title, imageUrl } = req.body;
    if (!isSafeImageUrl(imageUrl) || (title != null && (typeof title !== 'string' || title.length > 150))) {
      return res.status(400).json({ error: 'Invalid carousel data' });
    }
    res.status(201).json(await prisma.carouselItem.create({ data: { title: title?.trim() || '', imageUrl } }));
  } catch (error) { console.error(error); res.status(500).json({ error: 'Failed to create carousel item' }); }
};

export const deleteCarouselItem = async (req: Request, res: Response) => {
  try {
    await prisma.carouselItem.delete({ where: { id: String(req.params.id) } });
    res.json({ success: true });
  } catch (error) { console.error(error); res.status(500).json({ error: 'Failed to delete carousel item' }); }
};
