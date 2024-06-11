// middleware/errorMiddleware.js

// Middleware to handle requests for routes that are not found
const notFound = (req, res, next) => {
  // Create an error with a message indicating the route was not found
  const error = new Error(`Not Found - ${req.originalUrl}`);
  
  // Set the response status to 404 (Not Found)
  res.status(404);
  
  // Pass the error to the next middleware
  next(error);
};

// Middleware to handle all errors
const errorHandler = (err, req, res, next) => {
  // Set the status code to 500 (Internal Server Error) if the response status is 200 (OK)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Set the response status to the determined status code
  res.status(statusCode);
  
  // Send a JSON response with the error message and stack trace (omit stack trace in production)
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

// Export middleware
module.exports = { notFound, errorHandler };