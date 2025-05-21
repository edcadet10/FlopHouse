// This function handles deleting a story from either collection
const { Octokit } = require("@octokit/rest");

exports.handler = async (event, context) => {
  // Set CORS headers for all responses
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, DELETE, OPTIONS",
    "Content-Type": "application/json"
  };
  
  // Handle OPTIONS request (preflight)
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers,
      body: ""
    };
  }
  
  // Only allow POST or DELETE requests
  if (event.httpMethod !== "POST" && event.httpMethod !== "DELETE") {
    return { 
      statusCode: 405, 
      headers,
      body: JSON.stringify({ error: "Method Not Allowed" }) 
    };
  }
  
  try {
    // Extract the path parameter for collection and slug
    const pathParts = event.path.split('/');
    let collection, slug;
    
    if (event.httpMethod === "POST") {
      // For POST requests, get data from body
      const data = JSON.parse(event.body);
      collection = data.collection;
      slug = data.slug;
    } else {
      // For DELETE requests, get from path parameters
      // Format: /.netlify/functions/delete-story/collection/slug
      collection = pathParts[pathParts.length - 2];
      slug = pathParts[pathParts.length - 1];
    }
    
    console.log(`Delete request for ${collection}/${slug}`);
    
    if (!collection || !slug) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing required parameters: collection and slug" })
      };
    }
    
    // Validate collection (only allow stories or submissions)
    if (collection !== 'stories' && collection !== 'submissions') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Invalid collection. Must be 'stories' or 'submissions'" })
      };
    }
    
    // Use GitHub token from environment variables
    if (!process.env.GITHUB_TOKEN) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "GitHub token not configured" })
      };
    }
    
    // Initialize Octokit
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });
    
    // Repository details from environment variables
    const owner = process.env.GITHUB_OWNER || 'edcadet10';
    const repo = process.env.GITHUB_REPO || 'FlopHouse';
    const branch = process.env.GITHUB_BRANCH || 'main';
    
    // File path
    const filePath = `content/${collection}/${slug}.md`;
    
    // Get the file to get its SHA (required for deletion)
    try {
      const { data: fileData } = await octokit.repos.getContent({
        owner,
        repo,
        path: filePath,
        ref: branch
      });
      
      // Now delete the file
      await octokit.repos.deleteFile({
        owner,
        repo,
        path: filePath,
        message: `Delete ${collection} item: ${slug}`,
        sha: fileData.sha,
        branch
      });
      
      console.log(`Successfully deleted ${filePath}`);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: `Successfully deleted ${collection} item: ${slug}`,
          path: filePath
        })
      };
    } catch (error) {
      console.error(`Error deleting file: ${error.message}`);
      
      // If the file doesn't exist, that's technically a success
      if (error.status === 404) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            message: `File does not exist or was already deleted: ${filePath}`,
            path: filePath
          })
        };
      }
      
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  } catch (error) {
    console.error("Error handling delete request:", error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: "Failed to delete item",
        message: error.message
      })
    };
  }
};