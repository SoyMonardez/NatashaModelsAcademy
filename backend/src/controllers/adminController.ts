import { Request, Response, Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Dashboard Statistics
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Count users
    const userCount = await prisma.user.count();

    // Inscription statistics from FormSubmission
    const [inscriptions, modelRequestCount] = await Promise.all([
      prisma.formSubmission.findMany({ where: { type: 'INSCRIPTION' } }),
      prisma.formSubmission.count({ where: { type: 'MODEL_REQUEST' } })
    ]);

    // Aggregations
    const stats = {
      userCount,
      inscriptionCount: inscriptions.length,
      modelRequestCount,
      ageStats: {} as Record<string, number>,
      genderStats: {
        Femenino: 0,
        Masculino: 0,
        Otro: 0
      },
      locationStats: {} as Record<string, number>,
      sourceStats: {
        instagram: 0,
        facebook: 0,
        tiktok: 0,
        otro: 0
      }
    };

    inscriptions.forEach((sub: any) => {
      let data;
      try {
        data = typeof sub.data === 'string' ? JSON.parse(sub.data) : sub.data;
      } catch (e) {
        return;
      }
      
      if (!data) return;
      
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

      // Source stats
      if (data.como_conocio) {
        const source = data.como_conocio;
        if (source === 'instagram') stats.sourceStats.instagram++;
        else if (source === 'facebook') stats.sourceStats.facebook++;
        else if (source === 'tiktok') stats.sourceStats.tiktok++;
        else stats.sourceStats.otro++;
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
    if (!key || value === undefined) {
      return res.status(400).json({ error: 'Key and value are required' });
    }
    const setting = await prisma.systemSetting.upsert({
      where: { key: String(key) },
      update: { value: String(value) },
      create: { key: String(key), value: String(value) }
    });
    res.json(setting);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update setting' });
  }
};


