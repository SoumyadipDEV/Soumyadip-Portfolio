import supabase from '../config/supabaseClient.js';

export const createHttpError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const createListController = (tableName, options = {}) => {
  const {
    orderBy = 'display_order',
    ascending = true,
    filters = [],
    secondaryOrderBy = null,
    secondaryAscending = false,
    transform = null,
  } = options;

  return async (req, res, next) => {
    try {
      let query = supabase.from(tableName).select('*');

      filters.forEach((filter) => {
        query = query[filter.operator](filter.column, filter.value);
      });

      if (orderBy) {
        query = query.order(orderBy, { ascending });
      }

      if (secondaryOrderBy) {
        query = query.order(secondaryOrderBy, { ascending: secondaryAscending });
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      res.json({
        success: true,
        data: transform ? transform(data || []) : data || [],
      });
    } catch (error) {
      next(error);
    }
  };
};

export const createCreateController = (tableName) => async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .insert(req.body)
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

export const createUpdateController = (tableName) => async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      throw createHttpError('Resource not found', 404);
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const createDeleteController = (tableName) => async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', req.params.id)
      .select('id')
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      throw createHttpError('Resource not found', 404);
    }

    res.json({
      success: true,
      message: 'Resource deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
