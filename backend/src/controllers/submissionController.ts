import { Request, Response } from 'express';
import { PrismaClient, FormSubmissionType } from '@prisma/client';

const prisma = new PrismaClient();
const allowedTypes = new Set(['CONTACT', 'INSCRIPTION', 'MODEL_REQUEST']);

export const createSubmission = async (req: Request, res: Response) => {
  try {
    const { type, data } = req.body;
    if (typeof type !== 'string' || !allowedTypes.has(type) || data == null) {
      return res.status(400).json({ error: 'Invalid submission data' });
    }
    const serialized = typeof data === 'string' ? data : JSON.stringify(data);
    if (serialized.length < 2 || serialized.length > 20_000) {
      return res.status(400).json({ error: 'Invalid submission data' });
    }
    const submission = await prisma.formSubmission.create({
      data: { type: type as FormSubmissionType, data: serialized, status: 'PENDING' },
    });
    res.status(201).json(submission);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create submission' });
  }
};

export const getSubmissions = async (req: Request, res: Response) => {
  try {
    const type = typeof req.query.type === 'string' && allowedTypes.has(req.query.type) ? req.query.type : undefined;
    const submissions = await prisma.formSubmission.findMany({
      where: type ? { type: type as FormSubmissionType } : {},
      orderBy: { createdAt: 'desc' },
    });
    res.json(submissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
};

export const updateSubmissionStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (typeof status !== 'string' || !['PENDING', 'CONTACTED', 'CLOSED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    res.json(await prisma.formSubmission.update({ where: { id: String(req.params.id) }, data: { status } }));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update submission status' });
  }
};

export const deleteSubmission = async (req: Request, res: Response) => {
  try {
    await prisma.formSubmission.delete({ where: { id: String(req.params.id) } });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete submission' });
  }
};
