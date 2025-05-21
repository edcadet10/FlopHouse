// This function handles upvoting stories
const { Octokit } = require("@octokit/rest");
const matter = require("gray-matter");

// Add proper error logging
const logError = (err, context = '') => {
  console.error(`[${context}] ${err.message}`);
  console.error(err.stack);
  // In a production setup, you could send this to a logging service
};

exports.handler = async (event, context) => {
  // Set CORS headers for all responses
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json"
  };
  
  // Handle preflight requests
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
    
    // Check if storyId is provided
    if (!data.storyId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Story ID is required" })
      };
    }
    
    // Require GitHub token
    if (!process.env.GITHUB_TOKEN) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: "GitHub token is not configured",
          message: "Please contact the administrator to set up the GitHub token."
        })
      };
    }
    
    // Check for Netlify Identity authentication
    let userId = null;
    
    // Get user ID from context or auth header
    if (event.headers.authorization) {
      try {
        const authHeader = event.headers.authorization;
        const token = authHeader.split(' ')[1];
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        userId = payload.sub;
        console.log(`User authenticated: ${userId}`);
      } catch (authError) {
        console.error("Error parsing auth token:", authError);
      }
    }
    
    // If no valid authentication, but token was passed, return error
    if (event.headers.authorization && !userId) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          error: "Authentication failed",
          message: "Invalid authentication token"
        })
      };
    }
    
    // Record the user ID with the upvote if available
    const upvotes = await upvoteStoryInGitHub(data.storyId, userId);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "Upvote recorded successfully",
        storyId: data.storyId,
        upvotes,
        authenticated: !!userId
      })
    };
  } catch (err) {
    logError(err, 'upvote-story');
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: "Failed to process upvote",
        message: err.message
      })
    };
  }
};

// Function to update upvote count in GitHub
async function upvoteStoryInGitHub(storyId, userId = null) {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
  });
  
  // Repository details from environment variables
  const owner = process.env.GITHUB_OWNER || 'edcadet10';
  const repo = process.env.GITHUB_REPO || 'FlopHouse';
  const branch = process.env.GITHUB_BRANCH || 'main';
  const path = 'content/stories';
  
  try {
    // Get the content of the stories directory
    const { data: files } = await octokit.repos.getContent({
      owner,
      repo,
      path,
      ref: branch
    });
    
    // Find the file with the matching storyId
    const file = files.find(file => file.name.includes(storyId) || file.name.endsWith(`${storyId}.md`));
    
    if (!file) {
      throw new Error(`Story with ID ${storyId} not found`);
    }
    
    // Get the content of the file
    const fileData = await octokit.repos.getContent({
      owner,
      repo,
      path: file.path,
      ref: branch
    });
    
    // Decode content
    const content = Buffer.from(fileData.data.content, 'base64').toString();
    
    // Parse frontmatter
    const { data: frontmatter, content: storyContent } = matter(content);
    
    // Initialize upvotes array if it doesn't exist
    if (!frontmatter.upvoters) {
      frontmatter.upvoters = [];
    }
    
    // Store user ID if provided and not already in the array
    if (userId && !frontmatter.upvoters.includes(userId)) {
      frontmatter.upvoters.push(userId);
    } else if (!userId) {
      // For backward compatibility or anonymous upvotes
      // Create a placeholder entry for non-authenticated upvotes
      frontmatter.upvoters.push(`anon-${Date.now()}`);
    }
    
    // Set the upvote count based on the number of unique upvoters
    frontmatter.upvotes = frontmatter.upvoters.length;
    
    // Create updated content
    const updatedContent = matter.stringify(storyContent, frontmatter);
    
    // Update the file in GitHub
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: file.path,
      message: `Update upvote count for ${storyId}`,
      content: Buffer.from(updatedContent).toString('base64'),
      sha: fileData.data.sha,
      branch
    });
    
    return frontmatter.upvotes;
  } catch (err) {
    console.error("Error updating upvote in GitHub:", err);
    throw err;
  }
}