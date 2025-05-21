// This function handles publishing a submission to the stories collection
const { Octokit } = require("@octokit/rest");

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
    
    console.log(`Publishing story: ${slug}`);
    console.log(`Source path: ${sourcePath}`);
    console.log(`Destination path: ${destPath}`);
    
    // Initialize Octokit
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });
    
    // Step 1: First check if the source file exists and get its SHA
    let sourceSha;
    try {
      const sourceContent = await octokit.repos.getContent({
        owner,
        repo,
        path: sourcePath,
        ref: branch
      });
      sourceSha = sourceContent.data.sha;
      console.log(`Source file found with SHA: ${sourceSha}`);
    } catch (error) {
      console.warn(`Source file not found or cannot be read: ${error.message}`);
      // Continue anyway, we'll just create the destination file
    }
    
    // Step 2: Create the new file in the stories folder
    try {
      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: destPath,
        message: `Publish story: ${slug}`,
        content: Buffer.from(content).toString('base64'),
        branch
      });
      console.log(`Destination file created successfully: ${destPath}`);
    } catch (error) {
      console.error(`Failed to create destination file: ${error.message}`);
      throw new Error(`Failed to create published file: ${error.message}`);
    }
    
    // Step 3: Delete the original file from submissions if we found it
    if (sourceSha) {
      try {
        await octokit.repos.deleteFile({
          owner,
          repo,
          path: sourcePath,
          message: `Delete submission after publishing: ${slug}`,
          sha: sourceSha,
          branch
        });
        console.log(`Source file deleted successfully: ${sourcePath}`);
      } catch (error) {
        console.warn(`Failed to delete source file, but story was published: ${error.message}`);
        // We'll consider this a non-fatal error since the main goal of publishing was accomplished
      }
    }
    
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