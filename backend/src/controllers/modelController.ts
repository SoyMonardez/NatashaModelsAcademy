import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const logError = (msg: string, error: any) => {
  const logMsg = `[${new Date().toISOString()}] ${msg}: ${error.message}\n${error.stack}\n\n`;
  fs.appendFileSync(path.join(process.cwd(), 'backend_errors.log'), logMsg);
};

// Get all models with optional category filtering
export const getModels = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const filter = category && category !== 'ALL' ? { category: String(category) } : {};
    
    const models = await prisma.model.findMany({
      where: filter,
      include: { images: true },
      orderBy: { name: 'asc' }
    });
    
    res.json(models);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch models' });
  }
};

// Get single model
export const getModelById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const model = await prisma.model.findUnique({
      where: { id: String(id) },
      include: { images: true }
    });
    
    if (!model) {
      return res.status(404).json({ error: 'Model not found' });
    }
    
    res.json(model);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch model' });
  }
};

// Create admin-controlled route
export const createModel = async (req: Request, res: Response) => {
  try {
    console.log('Create Model Body:', req.body);
    console.log('Create Model Files:', req.files);

    const { name, age, height, sex, category, bust, waist, hips } = req.body;
    const files = req.files as Express.Multer.File[];
    
    if (!name ) {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }

    // Combine measurements
    const measurements = `B: ${bust || '-'} | W: ${waist || '-'} | H: ${hips || '-'}`;
    const imageUrls = files ? files.map(file => `/uploads/${file.filename}`) : [];

    const heightStr = String(height || '0').replace(',', '.');
    const numAge = Number(age);
    const numHeight = Number(heightStr);

    if (isNaN(numAge) || isNaN(numHeight)) {
      return res.status(400).json({ error: 'Edad y Altura deben ser números válidos' });
    }

    const newModel = await prisma.model.create({
      data: {
        name,
        age: numAge,
        height: numHeight,
        sex: sex || 'FEMENINO',
        category: category || 'ALTA COSTURA',
        measurements,
        images: {
          create: imageUrls.map(url => ({ url }))
        }
      },
      include: { images: true }
    });

    res.status(201).json(newModel);
  } catch (error: any) {
    console.error('SERVER ERROR (Create):', error);
    logError('SERVER ERROR (Create)', error);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ 
      error: 'Error interno del servidor al crear el modelo',
      details: error.message || 'Sin detalles'
    });
  }
};

export const updateModel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log('Update Model Request - ID:', id);
    console.log('Update Model Body:', req.body);
    console.log('Update Model Files:', req.files);

    const { name, age, height, sex, category, bust, waist, hips, existingImages } = req.body;
    const files = req.files as Express.Multer.File[];

    if (!name) {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }

    const measurements = `B: ${bust || '-'} | W: ${waist || '-'} | H: ${hips || '-'}`;
    
    // Convert height if it has a comma
    const heightStr = String(height || '0').replace(',', '.');
    const numAge = Number(age);
    const numHeight = Number(heightStr);

    if (isNaN(numAge) || isNaN(numHeight)) {
      return res.status(400).json({ error: 'Edad y Altura deben ser números válidos' });
    }

    let finalImageUrls: string[] = [];
    if (existingImages) {
        finalImageUrls = Array.isArray(existingImages) ? existingImages : [existingImages];
    }
    
    if (files && files.length > 0) {
        const newUrls = files.map(file => `/uploads/${file.filename}`);
        finalImageUrls = [...finalImageUrls, ...newUrls];
    }

    console.log('Final Image URLs to save:', finalImageUrls);

    // Check if model exists
    const model = await prisma.model.findUnique({ where: { id: String(id) } });
    if (!model) {
      return res.status(404).json({ error: 'El modelo no existe en la base de datos' });
    }

    const updatedModel = await prisma.model.update({
      where: { id: String(id) },
      data: {
        name,
        age: numAge,
        height: numHeight,
        sex: sex || 'FEMENINO',
        category: category || 'ALTA COSTURA',
        measurements,
        images: {
          deleteMany: {}, // Atomic delete within the update
          create: finalImageUrls.map(url => ({ url }))
        }
      },
      include: { images: true }
    });

    res.json(updatedModel);
  } catch (error: any) {
    console.error('SERVER ERROR (Update):', error);
    logError('SERVER ERROR (Update)', error);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ 
      error: 'Error interno del servidor al actualizar el modelo', 
      details: error.message || 'Sin detalles'
    });
  }
};

export const deleteModel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // First delete associated images
    await prisma.image.deleteMany({ where: { modelId: String(id) } });
    
    await prisma.model.delete({
      where: { id: String(id) }
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete model' });
  }
};
