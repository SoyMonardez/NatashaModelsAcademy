import { Request, Response, Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Dashboard Statistics
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Count users
    const userCount = await prisma.user.count();

    // Inscription statistics from FormSubmission
    const inscriptions = await prisma.formSubmission.findMany({
      where: { type: 'INSCRIPTION' }
    });

    // Aggregations
    const stats = {
      userCount,
      inscriptionCount: inscriptions.length,
      ageStats: {} as Record<string, number>,
      genderStats: {
        Femenino: 0,
        Masculino: 0,
        Otro: 0
      },
      locationStats: {} as Record<string, number>
    };

    inscriptions.forEach((sub: any) => {
      const data = sub.data as any;
      
      // Age grouping
      const age = parseInt(data.edad);
      const ageGroup = Math.floor(age / 5) * 5 + '-' + (Math.floor(age / 5) * 5 + 4);
      stats.ageStats[ageGroup] = (stats.ageStats[ageGroup] || 0) + 1;

      // Gender distribution
      if (data.sexo === 'Femenino') stats.genderStats.Femenino++;
      else if (data.sexo === 'Masculino') stats.genderStats.Masculino++;
      else stats.genderStats.Otro++;

      // Location (Department)
      if (data.origen_tipo === 'san_juan' && data.departamento) {
        stats.locationStats[data.departamento] = (stats.locationStats[data.departamento] || 0) + 1;
      }
    });

    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
};

// System Settings
export const getSettings = async (req: Request, res: Response) => {
  try {
    const settings = await prisma.systemSetting.findMany();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

export const updateSetting = async (req: Request, res: Response) => {
  try {
    const { key, value } = req.body;
    const setting = await prisma.systemSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    });
    res.json(setting);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update setting' });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { youtubeUrl } = req.body;
    const course = await prisma.course.update({
      where: { id },
      data: { youtubeUrl }
    });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update course' });
  }
};
