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
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  
  try {
    // Parse the request data
    const data = JSON.parse(event.body);
    
    // Check if storyId is provided
    if (!data.storyId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Story ID is required" })
      };
    }
    
    // Require GitHub token
    if (!process.env.GITHUB_TOKEN) {
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: "GitHub token is not configured",
          message: "Please contact the administrator to set up the GitHub token."
        })
      };
    }
    
    // Handle upvote in GitHub
    await upvoteStoryInGitHub(data.storyId);
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Upvote recorded successfully",
        storyId: data.storyId
      })
    };
  } catch (err) {
    logError(err, 'upvote-story');
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Failed to process upvote",
        message: err.message
      })
    };
  }
};

// Function to update upvote count in GitHub
async function upvoteStoryInGitHub(storyId) {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
  });
  
  // Repository details from environment variables
  const owner = process.env.GITHUB_OWNER || 'edcadet10';
  const repo = process.env.GITHUB_REPO || 'FlopHouse';
  const branch = process.env.GITHUB_BRANCH || 'content';
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
    
    // Increment upvotes
    frontmatter.upvotes = (frontmatter.upvotes || 0) + 1;
    
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