import supabase from '../config/supabaseClient.js';
import { createHttpError } from './crudControllerFactory.js';

export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      throw createHttpError('Resume PDF file is required', 400);
    }

    const timestamp = Date.now();
    const filePath = `resume_${timestamp}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(filePath, req.file.buffer, {
        contentType: 'application/pdf',
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('resumes').getPublicUrl(filePath);

    const { data: personalInfo, error: fetchError } = await supabase
      .from('personal_info')
      .select('id')
      .limit(1)
      .maybeSingle();

    if (fetchError) {
      throw fetchError;
    }

    if (!personalInfo) {
      throw createHttpError('Personal info row not found', 404);
    }

    const { error: updateError } = await supabase
      .from('personal_info')
      .update({ resume_url: publicUrl })
      .eq('id', personalInfo.id);

    if (updateError) {
      throw updateError;
    }

    res.json({
      success: true,
      url: publicUrl,
    });
  } catch (error) {
    next(error);
  }
};

export const getResume = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('personal_info')
      .select('resume_url')
      .limit(1)
      .maybeSingle();

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      url: data?.resume_url || null,
    });
  } catch (error) {
    next(error);
  }
};
