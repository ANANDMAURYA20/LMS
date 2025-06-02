const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Something went wrong';

    // Log error for debugging
    console.error('Error:', {
        message: err.message,
        stack: err.stack,
        statusCode: err.statusCode
    });

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
        // Include stack trace in development
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

export default errorMiddleware;
