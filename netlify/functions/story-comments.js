// This function handles adding and retrieving comments for a story
const { Octokit } = require("@octokit/rest");
const { Base64 } = require("js-base64");

exports.handler = async (event, context) => {
  // Set CORS headers for all responses
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
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
  
  try {
    // Get the story ID from path parameter
    const pathParts = event.path.split("/");
    const storyId = pathParts[pathParts.length - 1];
    
    if (!storyId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Story ID is required" })
      };
    }
    
    // Check if GitHub token is configured
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
    
    // Create Octokit instance
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });
    
    // Handle GET request (get comments)
    if (event.httpMethod === "GET") {
      try {
        // Comments file path
        const commentsPath = `content/comments/${storyId}.json`;
        
        // Check if comments file exists
        try {
          const { data: fileData } = await octokit.repos.getContent({
            owner,
            repo,
            path: commentsPath,
            ref: branch
          });
          
          // Decode content
          const content = Buffer.from(fileData.content, 'base64').toString();
          const comments = JSON.parse(content);
          
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ comments })
          };
        } catch (error) {
          // If file doesn't exist, return empty comments array
          if (error.status === 404) {
            return {
              statusCode: 200,
              headers,
              body: JSON.stringify({ comments: [] })
            };
          }
          throw error;
        }
      } catch (error) {
        console.error("Error getting comments:", error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: "Failed to retrieve comments" })
        };
      }
    }
    
    // Handle POST request (add comment)
    if (event.httpMethod === "POST") {
      try {
        const data = JSON.parse(event.body);
        const { name, comment } = data;
        
        if (!name || !comment) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: "Name and comment are required" })
          };
        }
        
        // Comments file path
        const commentsPath = `content/comments/${storyId}.json`;
        
        // Get existing comments or create new file
        let comments = [];
        let sha = null;
        
        try {
          // Try to get existing file
          const { data: fileData } = await octokit.repos.getContent({
            owner,
            repo,
            path: commentsPath,
            ref: branch
          });
          
          // Decode content
          const content = Buffer.from(fileData.content, 'base64').toString();
          comments = JSON.parse(content);
          sha = fileData.sha;
        } catch (error) {
          // If file doesn't exist, we'll create it
          if (error.status !== 404) {
            throw error;
          }
          
          // Create comments directory if it doesn't exist
          try {
            await octokit.repos.getContent({
              owner,
              repo,
              path: 'content/comments',
              ref: branch
            });
          } catch (dirError) {
            if (dirError.status === 404) {
              // Create directory
              await octokit.repos.createOrUpdateFileContents({
                owner,
                repo,
                path: 'content/comments/.gitkeep',
                message: 'Create comments directory',
                content: '',
                branch
              });
            } else {
              throw dirError;
            }
          }
        }
        
        // Add new comment
        const newComment = {
          id: Date.now().toString(),
          name,
          comment,
          date: new Date().toISOString()
        };
        
        comments.push(newComment);
        
        // Save comments to file
        const content = JSON.stringify(comments, null, 2);
        const encodedContent = Base64.encode(content);
        
        const response = await octokit.repos.createOrUpdateFileContents({
          owner,
          repo,
          path: commentsPath,
          message: `Add comment to story ${storyId}`,
          content: encodedContent,
          ...(sha ? { sha } : {}),
          branch
        });
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            comment: newComment
          })
        };
      } catch (error) {
        console.error("Error adding comment:", error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: "Failed to add comment" })
        };
      }
    }
    
    // Handle unsupported methods
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  } catch (err) {
    console.error("Error in story-comments handler:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal Server Error" })
    };
  }
};