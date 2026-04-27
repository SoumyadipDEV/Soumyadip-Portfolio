const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || error.status || 500;
  const isDevelopment = process.env.NODE_ENV === 'development';

  res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal Server Error',
    ...(isDevelopment && { stack: error.stack }),
  });
};

export default errorHandler;
