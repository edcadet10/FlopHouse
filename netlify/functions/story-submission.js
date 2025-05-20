// This function will process form submissions and store them in GitHub
exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  
  try {
    // Parse the form data
    const data = JSON.parse(event.body);
    
    // This would normally connect to GitHub API to create an issue or commit
    // For now, we'll just return success
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Story submission received successfully",
        data: data
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};