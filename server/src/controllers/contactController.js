import nodemailer from 'nodemailer';

import supabase from '../config/supabaseClient.js';
import {
  getAutoReplyEmailTemplate,
  getNotificationEmailTemplate,
  getReplyEmailTemplate,
} from '../utils/emailTemplates.js';

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

    try {
      const developerEmail = process.env.DEVELOPER_EMAIL;

      if (!developerEmail) {
        throw createHttpError('DEVELOPER_EMAIL is not configured', 500);
      }

      const transporter = getMailTransporter();
      const emailSubject = subject?.trim() || 'No Subject';

      await Promise.all([
        transporter.sendMail({
          to: developerEmail,
          from: process.env.SMTP_USER,
          replyTo: sender_email,
          subject: `New Portfolio Contact: ${emailSubject}`,
          html: getNotificationEmailTemplate({
            senderName: sender_name,
            senderEmail: sender_email,
            subject,
            message,
          }),
        }),
        transporter.sendMail({
          to: sender_email,
          from: process.env.SMTP_USER,
          subject: `Thank you for contacting me, ${sender_name}!`,
          html: getAutoReplyEmailTemplate({
            senderName: sender_name,
            subject,
          }),
        }),
      ]);
    } catch (emailError) {
      console.error('Failed to send contact emails:', emailError);
    }

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

export const replyToContactMessage = async (req, res, next) => {
  try {
    const replyBody = String(req.body.replyBody ?? '').trim();

    if (!replyBody) {
      throw createHttpError('Reply body is required', 422);
    }

    const { data: originalMessage, error: fetchError } = await supabase
      .from('contact_messages')
      .select('*')
      .eq('id', req.params.id)
      .maybeSingle();

    if (fetchError) {
      throw fetchError;
    }

    if (!originalMessage) {
      throw createHttpError('Message not found', 404);
    }

    const developerEmail = process.env.DEVELOPER_EMAIL;

    if (!developerEmail) {
      throw createHttpError('DEVELOPER_EMAIL is not configured', 500);
    }

    const originalSubject = originalMessage.subject?.trim() || 'Your message';
    const transporter = getMailTransporter();

    await transporter.sendMail({
      to: originalMessage.sender_email,
      from: process.env.SMTP_USER,
      replyTo: developerEmail,
      subject: `Re: ${originalSubject}`,
      html: getReplyEmailTemplate({
        senderName: originalMessage.sender_name,
        replyBody,
        originalSubject,
      }),
    });

    const { error: insertError } = await supabase.from('message_replies').insert({
      message_id: req.params.id,
      reply_body: replyBody,
      replied_to_email: originalMessage.sender_email,
      replied_to_name: originalMessage.sender_name,
      original_subject: originalMessage.subject,
    });

    if (insertError) {
      throw insertError;
    }

    const { error: updateError } = await supabase
      .from('contact_messages')
      .update({
        is_replied: true,
        replied_at: new Date().toISOString(),
        is_read: true,
      })
      .eq('id', req.params.id);

    if (updateError) {
      throw updateError;
    }

    res.json({
      success: true,
      message: 'Reply sent successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getMessageReplies = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('message_replies')
      .select('*')
      .eq('message_id', req.params.id)
      .order('sent_at', { ascending: true });

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
