// This function handles publishing a submission to the stories collection
const fetch = require("node-fetch");
const { Base64 } = require("js-base64");

exports.handler = async (event, context) => {
  // Set CORS headers for all responses
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
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
  
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return { 
      statusCode: 405, 
      headers,
      body: JSON.stringify({ error: "Method Not Allowed" }) 
    };
  }
  
  try {
    // Parse the request data
    const data = JSON.parse(event.body);
    const { slug, content } = data;
    
    if (!slug || !content) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing required fields: slug and content" })
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
    
    // Repository details from environment variables
    const owner = process.env.GITHUB_OWNER || 'edcadet10';
    const repo = process.env.GITHUB_REPO || 'FlopHouse';
    const branch = process.env.GITHUB_BRANCH || 'main';
    
    // Create paths for source and destination
    const sourcePath = `content/submissions/${slug}.md`;
    const destPath = `content/stories/${slug}.md`;
    
    // Create base64 encoded content
    const encodedContent = Base64.encode(content);
    
    // 1. First, create the new file in the stories folder
    const createResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${destPath}`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'FlopHouse-Netlify-Function'
      },
      body: JSON.stringify({
        message: `Publish story: ${slug}`,
        content: encodedContent,
        branch
      })
    });
    
    if (!createResponse.ok) {
      const error = await createResponse.json();
      throw new Error(`Failed to create published file: ${createResponse.status} - ${JSON.stringify(error)}`);
    }
    
    // 2. Delete the original file from submissions (optional)
    // You can uncomment this if you want to delete the submission after publishing
    /*
    const deleteResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${sourcePath}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'FlopHouse-Netlify-Function'
      },
      body: JSON.stringify({
        message: `Delete submission after publishing: ${slug}`,
        branch,
        sha: sha  // Would need to get the file's SHA first
      })
    });
    
    if (!deleteResponse.ok) {
      console.warn("Failed to delete original submission file, but story was published");
    }
    */
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "Story published successfully",
        slug,
        path: destPath
      })
    };
  } catch (error) {
    console.error("Error publishing story:", error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: "Failed to publish story",
        message: error.message
      })
    };
  }
};