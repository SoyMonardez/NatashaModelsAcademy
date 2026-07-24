import { Request, Response } from 'express';
import { sendEmail } from '../services/emailService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
}[char] as string));

export const handleContactSubmit = async (req: Request, res: Response) => {
  try {
    const { name, phone, email, subject, description } = req.body;
    const fields = { name, phone, email: email || '', subject, description };
    if (Object.values(fields).some(value => typeof value !== 'string') ||
        name.trim().length < 1 || name.length > 100 || phone.length > 30 ||
        email.length > 254 || /[\r\n]/.test(email) || subject.trim().length < 1 || subject.length > 150 || /[\r\n]/.test(subject) ||
        description.trim().length < 1 || description.length > 5000) {
      return res.status(400).json({ success: false, error: 'Invalid contact data' });
    }

    const clean = {
      name: name.trim(), phone: phone.trim(), email: email.trim(),
      subject: subject.trim(), description: description.trim(),
    };
    const submission = await prisma.formSubmission.create({
      data: { type: 'CONTACT', data: JSON.stringify(clean) },
    });

    const adminEmail = process.env.EMAIL_USER;
    if (adminEmail) {
      const html = `<h3>Nueva consulta desde la web</h3><ul>` +
        `<li><b>Nombre:</b> ${escapeHtml(clean.name)}</li>` +
        `<li><b>Teléfono:</b> ${escapeHtml(clean.phone)}</li>` +
        `<li><b>Email:</b> ${escapeHtml(clean.email || 'No provisto')}</li></ul>` +
        `<p><b>Mensaje:</b><br/>${escapeHtml(clean.description).replace(/\n/g, '<br/>')}</p>`;
      const text = `Nombre: ${clean.name}\nTeléfono: ${clean.phone}\nEmail: ${clean.email || 'No provisto'}\n\nMensaje:\n${clean.description}`;
      await sendEmail(adminEmail, `Nueva Consulta de Web: ${clean.subject}`, text, html);
    }

    res.status(200).json({ success: true, message: 'Message received and saved.', id: submission.id });
  } catch (error) {
    console.error('Error handling contact submission:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

