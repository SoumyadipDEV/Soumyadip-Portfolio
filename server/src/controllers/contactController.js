import nodemailer from 'nodemailer';

import supabase from '../config/supabaseClient.js';

const createHttpError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const getMailTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw createHttpError('SMTP configuration is incomplete', 500);
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
};

const buildContactEmailBody = ({ sender_name, sender_email, subject, message }) => `
New portfolio contact message

Name: ${sender_name}
Email: ${sender_email}
Subject: ${subject || 'No subject'}

Message:
${message}
`;

export const sendContactMessage = async (req, res, next) => {
  try {
    const { sender_name, sender_email, subject, message } = req.body;

    const { error } = await supabase.from('contact_messages').insert({
      sender_name,
      sender_email,
      subject,
      message,
    });

    if (error) {
      throw error;
    }

    const developerEmail = process.env.DEVELOPER_EMAIL;

    if (!developerEmail) {
      throw createHttpError('DEVELOPER_EMAIL is not configured', 500);
    }

    const transporter = getMailTransporter();
    const safeSubject = subject?.trim() || 'No subject';

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: developerEmail,
      replyTo: sender_email,
      subject: `New Portfolio Contact: ${safeSubject}`,
      text: buildContactEmailBody({ sender_name, sender_email, subject, message }),
    });

    res.json({
      success: true,
      message: 'Message sent successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getContactMessages = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('received_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    next(error);
  }
};

export const markMessageAsRead = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .update({ is_read: true })
      .eq('id', req.params.id)
      .select()
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      throw createHttpError('Message not found', 404);
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContactMessage = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', req.params.id)
      .select('id')
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      throw createHttpError('Message not found', 404);
    }

    res.json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
