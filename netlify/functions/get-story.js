// This function retrieves a single story by ID or slug
const { Octokit } = require("@octokit/rest");
const matter = require("gray-matter");
const marked = require("marked");

// Add proper error logging
const logError = (err, context = '') => {
  console.error(`[${context}] ${err.message}`);
  console.error(err.stack);
  // In a production setup, you could send this to a logging service
};

exports.handler = async (event, context) => {
  try {
    // Get story ID or slug from path parameter
    const storyId = event.path.split("/").pop();
    
    if (!storyId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Story ID or slug is required" })
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
    
    // Try to fetch the story from GitHub
    const story = await fetchStoryFromGitHub(storyId);
    
    // If story not found
    if (!story) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Story not found" })
      };
    }
    
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=600" // Cache for 10 minutes
      },
      body: JSON.stringify(story)
    };
  } catch (err) {
    logError(err, 'get-story');
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Failed to fetch story",
        message: err.message
      })
    };
  }
};

// Function to fetch a single story from GitHub
async function fetchStoryFromGitHub(storyId) {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
  });
  
  // Repository details from environment variables
  const owner = process.env.GITHUB_OWNER || 'edcadet10';
  const repo = process.env.GITHUB_REPO || 'FlopHouse';
  const branch = process.env.GITHUB_BRANCH || 'main';
  const path = 'content/stories';
  
  try {
    console.log(`Searching for story with ID/slug: ${storyId}`);
    
    // Get the content of the stories directory
    const { data: files } = await octokit.repos.getContent({
      owner,
      repo,
      path,
      ref: branch
    });
    
    // Filter markdown files
    const mdFiles = files.filter(file => file.name.endsWith('.md') && file.name !== 'README.md');
    console.log(`Found ${mdFiles.length} markdown files in stories directory`);
    
    // Try direct match first (exact filename)
    let file = mdFiles.find(file => 
      file.name === `${storyId}.md` || 
      file.name === storyId
    );
    
    // If no direct match, try partial matches
    if (!file) {
      file = mdFiles.find(file => 
        file.name.includes(storyId) || 
        file.name.startsWith(`${storyId}-`) || 
        file.name.endsWith(`-${storyId}.md`)
      );
    }
    
    if (!file) {
      console.log(`No file found for story ID/slug: ${storyId}`);
      return null;
    }
    
    console.log(`Found file ${file.path} for story ID/slug: ${storyId}`);
    
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
    
    // Only return published stories
    if (frontmatter.published === false) {
      console.log(`Story ${storyId} is not published`);
      return null;
    }
    
    // Convert markdown to HTML
    const contentHtml = marked.parse(storyContent);
    
    // Create readable date format and calculate read time
    const readTime = calculateReadTime(storyContent);
    const date = formatDate(frontmatter.date);
    
    console.log(`Successfully formatted story ${storyId}`);
    
    // Return formatted story data
    return {
      id: frontmatter.id || file.name.replace('.md', ''),
      title: frontmatter.title || "Untitled Story",
      companyName: frontmatter.companyName || "Unknown Company",
      industry: frontmatter.industry || "Technology",
      fundingAmount: frontmatter.fundingAmount || "Not specified",
      failureReason: frontmatter.failureReason || "Multiple Factors",
      content: storyContent,
      contentHtml,
      date,
      readTime,
      upvotes: frontmatter.upvotes || 0,
      slug: frontmatter.slug || file.name.replace('.md', '')
    };
  } catch (err) {
    console.error("Error fetching story from GitHub:", err);
    return null;
  }
}

// Function to calculate estimated read time
function calculateReadTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readTime} min read`;
}

// Function to format date in a readable format
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 1) {
    return 'today';
  } else if (diffDays <= 7) {
    return `${diffDays} days ago`;
  } else if (diffDays <= 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else {
    const months = Math.floor(diffDays / 30);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  }
}

// Remove getMockStory function