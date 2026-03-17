import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getNews = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const filter = category && category !== 'TODAS' ? { category: String(category) } : {};
    
    const news = await prisma.news.findMany({
      where: filter,
      orderBy: { date: 'desc' }
    });
    
    res.json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
};

export const createNews = async (req: Request, res: Response) => {
  try {
    const { title, content, imageUrl, category, date } = req.body;
    
    const newNews = await prisma.news.create({
      data: {
        title,
        content,
        imageUrl,
        category,
        date: date ? new Date(date) : new Date(),
      }
    });

    res.status(201).json(newNews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create news' });
  }
};

export const deleteNews = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.news.delete({
      where: { id: String(id) }
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete news' });
  }
};
