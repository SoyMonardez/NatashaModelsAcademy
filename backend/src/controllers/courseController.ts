import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCourses = async (req: Request, res: Response) => {
  try {
    const { type, category, professor } = req.query;
    
    // Build filters dynamically
    const filter: any = {};
    if (type && type !== 'TODOS') filter.type = String(type);
    if (category && category !== 'TODOS') filter.category = String(category);
    if (professor && professor !== 'TODOS') filter.professor = String(professor);

    const courses = await prisma.course.findMany({
      where: filter,
    });
    
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

export const getCourseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const course = await prisma.course.findUnique({
      where: { id: String(id) }
    });
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
};

export const createCourse = async (req: Request, res: Response) => {
  try {
    const { title, youtubeUrl, type, category, professor } = req.body;
    
    const newCourse = await prisma.course.create({
      data: {
        title,
        youtubeUrl: youtubeUrl || '',
        type,
        category,
        professor,
      }
    });

    res.status(201).json(newCourse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create course' });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.course.delete({
      where: { id: String(id) }
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
};
