// This function handles upvoting stories
const { Octokit } = require("@octokit/rest");
const matter = require("gray-matter");

// Add proper error logging
const logError = (err, context = '') => {
  console.error(`[${context}] ${err.message}`);
  console.error(err.stack);
  // In a production setup, you could send this to a logging service
};

// Function to safely decode a JWT token
function decodeJWT(token) {
  try {
    // Split the token
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }
    
    // Get the payload part (second part)
    const payload = parts[1];
    
    // Add padding if needed
    const pad = payload.length % 4;
    const paddedPayload = pad ? 
      payload + '='.repeat(4 - pad) : 
      payload;
    
    // Decode and parse
    const decoded = Buffer.from(paddedPayload, 'base64').toString();
    return JSON.parse(decoded);
  } catch (err) {
    console.error('Error decoding JWT:', err);
    return null;
  }
}

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
    let data;
    try {
      data = JSON.parse(event.body);
      console.log("Request data:", JSON.stringify(data));
    } catch (parseError) {
      console.error("Error parsing request body:", parseError);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: "Invalid JSON format", 
          details: parseError.message 
        })
      };
    }
    
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
    
    // First check if the user is authenticated through Netlify Identity context
    if (context.clientContext && context.clientContext.user) {
      userId = context.clientContext.user.sub;
      console.log(`User authenticated via Netlify Identity context: ${userId}`);
    } 
    // Fallback to manual token parsing if context is not available
    else if (event.headers.authorization) {
      try {
        const authHeader = event.headers.authorization;
        const token = authHeader.split(' ')[1];
        const payload = decodeJWT(token);
        
        if (payload && payload.sub) {
          userId = payload.sub;
          console.log(`User authenticated via token parsing: ${userId}`);
        }
      } catch (authError) {
        console.error("Error parsing auth token:", authError);
      }
    }
    
    // Debug info
    console.log("Auth header present:", !!event.headers.authorization);
    console.log("Context client context:", JSON.stringify(context.clientContext || {}));
    
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
    // Enhanced error logging
    logError(err, 'upvote-story');
    
    // More detailed error response
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: "Failed to process upvote",
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        details: {
          storyId: data?.storyId,
          authenticated: !!userId,
          requestId: context.awsRequestId
        }
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
    console.log(`Upvoting story ${storyId} for user ${userId || 'anonymous'}`);
    console.log(`Repo: ${owner}/${repo}, Branch: ${branch}`);
    
    // Get the content of the stories directory
    const { data: files } = await octokit.repos.getContent({
      owner,
      repo,
      path,
      ref: branch
    });
    
    console.log(`Found ${files.length} files in stories directory`);
    
    // Find the file with the matching storyId
    const file = files.find(file => file.name.includes(storyId) || file.name.endsWith(`${storyId}.md`));
    
    if (!file) {
      console.error(`Story with ID ${storyId} not found in files:`, files.map(f => f.name));
      throw new Error(`Story with ID ${storyId} not found`);
    }
    
    console.log(`Found file: ${file.path}`);
    
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
    
    console.log("Current frontmatter:", JSON.stringify(frontmatter));
    
    // Initialize upvoters array if it doesn't exist
    if (!frontmatter.upvoters) {
      frontmatter.upvoters = [];
    }
    
    // Create a unique anonymous ID if not authenticated
    const anonId = !userId ? `anon-${Date.now()}` : null;
    
    // Check if user has already upvoted
    if (userId && frontmatter.upvoters.includes(userId)) {
      console.log(`User ${userId} has already upvoted this story`);
      return frontmatter.upvotes;
    }
    
    // Store user ID if provided or anonymous ID
    if (userId) {
      frontmatter.upvoters.push(userId);
    } else {
      frontmatter.upvoters.push(anonId);
    }
    
    // Set the upvote count based on the number of unique upvoters
    frontmatter.upvotes = frontmatter.upvoters.length;
    
    console.log(`Updated upvotes to ${frontmatter.upvotes}`);
    
    // Create updated content
    const updatedContent = matter.stringify(storyContent, frontmatter);
    
    // Update the file in GitHub
    const updateResult = await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: file.path,
      message: `Update upvote count for ${storyId}`,
      content: Buffer.from(updatedContent).toString('base64'),
      sha: fileData.data.sha,
      branch
    });
    
    console.log(`File updated successfully: ${updateResult.data.commit.html_url}`);
    
    return frontmatter.upvotes;
  } catch (err) {
    console.error("Error updating upvote in GitHub:", err);
    throw err;
  }
}