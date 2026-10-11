/**
 * Global Error Handler Middleware
 * Catches all errors thrown in route handlers and returns clean JSON responses.
 */

function errorHandler(err, req, res, next) {
  console.error(`[MAYA Error] ${err.message}`);

  // Gemini API errors
  if (err.message && err.message.includes('API_KEY')) {
    return res.status(401).json({
      error: 'Invalid or missing API key. Please check your GEMINI_API_KEY in the .env file.',
    });
  }

  // Rate limit errors
  if (err.status === 429 || (err.message && err.message.includes('quota'))) {
    return res.status(429).json({
      error: 'Rate limit reached. Please wait a moment and try again.',
    });
  }

  // Network/timeout errors
  if (err.code === 'ENOTFOUND' || err.code === 'ETIMEDOUT') {
    return res.status(503).json({
      error: 'Cannot reach AI service. Please check your internet connection.',
    });
  }

  // Default server error
  return res.status(500).json({
    error: err.message || 'An unexpected error occurred. Please try again.',
  });
}

module.exports = { errorHandler };
