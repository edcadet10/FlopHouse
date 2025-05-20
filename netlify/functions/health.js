// Health check endpoint for monitoring
const { Octokit } = require("@octokit/rest");

// Add proper error logging
const logError = (err, context = '') => {
  console.error(`[${context}] ${err.message}`);
  console.error(err.stack);
  // In a production setup, you could send this to a logging service
};

exports.handler = async (event, context) => {
  try {
    // Check GitHub API connection
    if (!process.env.GITHUB_TOKEN) {
      return {
        statusCode: 503,
        body: JSON.stringify({
          status: "error",
          message: "GitHub token is not configured",
          timestamp: new Date().toISOString()
        })
      };
    }
    
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });
    
    // Try to get rate limit info (lightweight request)
    await octokit.rateLimit.get();
    
    // If we get here, GitHub API is working
    return {
      statusCode: 200,
      body: JSON.stringify({
        status: "ok",
        message: "API is functioning correctly",
        timestamp: new Date().toISOString()
      })
    };
  } catch (err) {
    logError(err, 'health-check');
    
    return {
      statusCode: 503,
      body: JSON.stringify({
        status: "error",
        message: err.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};