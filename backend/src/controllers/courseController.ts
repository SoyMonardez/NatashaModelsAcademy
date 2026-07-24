import { Request, Response } from 'express';
import { PrismaClient, CourseType } from '@prisma/client';

const prisma = new PrismaClient();
const textFields = ['title', 'category', 'professor'] as const;

const getYoutubeID = (url: string) => {
  if (!url) return '';
  const match = url.match(/^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
  return match?.[2]?.length === 11 ? match[2] : url;
};

const canSeePremium = (req: Request) => Boolean((req as any).user?.userId);
const presentCourse = (course: any, includePremium: boolean) => (
  course.type === 'FREE' || includePremium ? course : { ...course, youtubeUrl: null }
);

const validateCourse = (body: any) => {
  if (!body || typeof body !== 'object') return null;
  for (const field of textFields) {
    if (typeof body[field] !== 'string' || body[field].trim().length < 1 || body[field].length > 150) return null;
  }
  if (!['FREE', 'PREMIUM'].includes(body.type) || typeof body.youtubeUrl !== 'string' || body.youtubeUrl.length > 500) return null;
  if (body.description != null && (typeof body.description !== 'string' || body.description.length > 10_000)) return null;
  if (body.duration != null && (typeof body.duration !== 'string' || body.duration.length > 50)) return null;
  return {
    title: body.title.trim(),
    youtubeUrl: getYoutubeID(body.youtubeUrl),
    type: body.type as CourseType,
    category: body.category.trim(),
    professor: body.professor.trim(),
    description: body.description?.trim() || null,
    duration: body.duration?.trim() || null,
  };
};

export const getCourses = async (req: Request, res: Response) => {
  try {
    const { type, category, professor } = req.query;
    const filter: any = {};
    if (type && type !== 'TODOS' && ['FREE', 'PREMIUM'].includes(String(type))) filter.type = String(type);
    if (category && category !== 'TODOS') filter.category = String(category).slice(0, 150);
    if (professor && professor !== 'TODOS') filter.professor = String(professor).slice(0, 150);
    const courses = await prisma.course.findMany({ where: filter });
    res.json(courses.map(course => presentCourse(course, canSeePremium(req))));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

export const getCourseById = async (req: Request, res: Response) => {
  try {
    const course = await prisma.course.findUnique({ where: { id: String(req.params.id) } });
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(presentCourse(course, canSeePremium(req)));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
};

export const createCourse = async (req: Request, res: Response) => {
  try {
    const data = validateCourse(req.body);
    if (!data) return res.status(400).json({ error: 'Invalid course data' });
    res.status(201).json(await prisma.course.create({ data }));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create course' });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const data = validateCourse(req.body);
    if (!data) return res.status(400).json({ error: 'Invalid course data' });
    res.json(await prisma.course.update({ where: { id: String(req.params.id) }, data }));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update course' });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    await prisma.course.delete({ where: { id: String(req.params.id) } });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
};
