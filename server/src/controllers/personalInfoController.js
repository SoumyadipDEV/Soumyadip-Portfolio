import supabase from '../config/supabaseClient.js';

export const getPersonalInfo = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('personal_info')
      .select('*')
      .limit(1)
      .maybeSingle();

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

export const updatePersonalInfo = async (req, res, next) => {
  try {
    const { data: existingRow, error: fetchError } = await supabase
      .from('personal_info')
      .select('id')
      .limit(1)
      .maybeSingle();

    if (fetchError) {
      throw fetchError;
    }

    const query = existingRow
      ? supabase.from('personal_info').update(req.body).eq('id', existingRow.id)
      : supabase.from('personal_info').insert(req.body);

    const { data, error } = await query.select().single();

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
