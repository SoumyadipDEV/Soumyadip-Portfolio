import supabase from '../config/supabaseClient.js';
import { createHttpError } from './crudControllerFactory.js';

const tableName = 'typewriter_roles';

export const getTypewriterRoles = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('display_order', { ascending: true });

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

export const createTypewriterRole = async (req, res, next) => {
  try {
    const { role_text, display_order } = req.body;

    if (!role_text || role_text.trim() === '') {
      throw createHttpError('Role text is required', 400);
    }

    const { data, error } = await supabase
      .from(tableName)
      .insert([
        {
          role_text: role_text.trim(),
          display_order: display_order || 0,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTypewriterRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role_text, display_order } = req.body;

    if (!role_text || role_text.trim() === '') {
      throw createHttpError('Role text is required', 400);
    }

    const { data, error } = await supabase
      .from(tableName)
      .update({
        role_text: role_text.trim(),
        display_order: display_order || 0,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTypewriterRole = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: 'Role deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
