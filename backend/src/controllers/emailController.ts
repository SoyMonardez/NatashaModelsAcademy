import { Request, Response } from 'express';
import { sendEmail } from '../services/emailService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const handleContactSubmit = async (req: Request, res: Response) => {
  try {
    const { name, phone, email, subject, description } = req.body;

    // 1. Save to database via Prisma
    const submission = await prisma.formSubmission.create({
      data: {
        type: 'CONTACT',
        data: { name, phone, email, subject, description }
      }
    });

    // 2. Send email notification to Admin
    const adminEmail = process.env.EMAIL_USER; // Send to ourselves essentially (or another admin address)
    const emailSubject = `Nueva Consulta de Web: ${subject}`;
    const emailText = `Nombre: ${name}\nTeléfono: ${phone}\nEmail: ${email || 'No provisto'}\n\nMensaje:\n${description}`;
    const emailHtml = `
      <h3>Nueva consulta desde la web</h3>
      <ul>
        <li><b>Nombre:</b> ${name}</li>
        <li><b>Teléfono:</b> ${phone}</li>
        <li><b>Email:</b> ${email || 'No provisto'}</li>
      </ul>
      <p><b>Mensaj:</b><br/>${description}</p>
    `;

    if (adminEmail) {
      await sendEmail(adminEmail, emailSubject, emailText, emailHtml);
    }

    res.status(200).json({ success: true, message: 'Message received and saved.', id: submission.id });
  } catch (error) {
    console.error("Error handling contact submission:", error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
