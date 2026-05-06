import supabase from '../config/supabaseClient.js';
import { createHttpError } from './crudControllerFactory.js';

const resumeBucketName = 'resumes';

const getResumeStoragePath = (resumeUrl) => {
  if (!resumeUrl) {
    return null;
  }

  try {
    const { pathname } = new URL(resumeUrl);
    const bucketMarker = `/storage/v1/object/public/${resumeBucketName}/`;
    const bucketIndex = pathname.indexOf(bucketMarker);

    if (bucketIndex === -1) {
      return null;
    }

    return decodeURIComponent(pathname.slice(bucketIndex + bucketMarker.length));
  } catch {
    return null;
  }
};

export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      throw createHttpError('Resume PDF file is required', 400);
    }

    const timestamp = Date.now();
    const filePath = `resume_${timestamp}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from(resumeBucketName)
      .upload(filePath, req.file.buffer, {
        contentType: 'application/pdf',
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(resumeBucketName).getPublicUrl(filePath);

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

export const deleteResume = async (req, res, next) => {
  try {
    const { data: personalInfo, error: fetchError } = await supabase
      .from('personal_info')
      .select('id, resume_url')
      .limit(1)
      .maybeSingle();

    if (fetchError) {
      throw fetchError;
    }

    if (!personalInfo) {
      throw createHttpError('Personal info row not found', 404);
    }

    const storagePath = getResumeStoragePath(personalInfo.resume_url);

    if (storagePath) {
      const { error: removeError } = await supabase.storage
        .from(resumeBucketName)
        .remove([storagePath]);

      if (removeError) {
        throw removeError;
      }
    }

    const { error: updateError } = await supabase
      .from('personal_info')
      .update({ resume_url: null })
      .eq('id', personalInfo.id);

    if (updateError) {
      throw updateError;
    }

    res.json({
      success: true,
      message: 'Resume deleted successfully',
      url: null,
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
