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
    const { title, content, category, date } = req.body;
    let imageUrl = req.body.imageUrl;

    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    if (!title || !content || !imageUrl || !category) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    
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

export const updateNews = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, category, date } = req.body;
    let imageUrl = req.body.imageUrl;

    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedNews = await prisma.news.update({
      where: { id: String(id) },
      data: {
        title,
        content,
        category,
        imageUrl: imageUrl || undefined,
        date: date ? new Date(date) : undefined,
      }
    });

    res.json(updatedNews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update news' });
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
