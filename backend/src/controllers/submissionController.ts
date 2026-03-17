import { Request, Response } from 'express';
import { PrismaClient, FormSubmissionType } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new submission
export const createSubmission = async (req: Request, res: Response) => {
  try {
    const { type, data } = req.body;
    
    if (!type || !data) {
      return res.status(400).json({ error: 'Type and data are required' });
    }

    const submission = await prisma.formSubmission.create({
      data: {
        type: type as FormSubmissionType,
        data: typeof data === 'string' ? data : JSON.stringify(data),
        status: 'PENDING'
      }
    });

    res.status(201).json(submission);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create submission' });
  }
};

// Get all submissions, optionally filtered by type
export const getSubmissions = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    const filter = type ? { type: type as FormSubmissionType } : {};
    
    const submissions = await prisma.formSubmission.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' },
    });
    
    res.json(submissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
};

// Update submission status (e.g. from PENDING to CONTACTED)
export const updateSubmissionStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const updatedSubmission = await prisma.formSubmission.update({
      where: { id: String(id) },
      data: { status },
    });

    res.json(updatedSubmission);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update submission status' });
  }
};

// Delete a submission
export const deleteSubmission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.formSubmission.delete({
      where: { id: String(id) }
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete submission' });
  }
};
