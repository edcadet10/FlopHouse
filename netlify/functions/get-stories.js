// This function will retrieve stories from the content directory in GitHub
const { Octokit } = require("@octokit/rest");
const matter = require("gray-matter");

// Add proper error logging
const logError = (err, context = '') => {
  console.error(`[${context}] ${err.message}`);
  console.error(err.stack);
  // In a production setup, you could send this to a logging service
};

exports.handler = async (event, context) => {
  try {
    // Get query parameters
    const queryParams = event.queryStringParameters || {};
    const limit = parseInt(queryParams.limit) || 20;
    const page = parseInt(queryParams.page) || 1;
    const industry = queryParams.industry || null;
    const failureReason = queryParams.failureReason || null;
    
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
    
    // Always fetch from GitHub
    let stories = await fetchStoriesFromGitHub();
    
    // Apply filters if needed
    if (industry) {
      stories = stories.filter(story => story.industry.toLowerCase() === industry.toLowerCase());
    }
    
    if (failureReason) {
      stories = stories.filter(story => story.failureReason.toLowerCase() === failureReason.toLowerCase());
    }
    
    // Sort by date, newest first
    stories = stories.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Simple pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedStories = stories.slice(startIndex, endIndex);
    
    // Calculate total pages
    const totalPages = Math.ceil(stories.length / limit);
    
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300" // Cache for 5 minutes
      },
      body: JSON.stringify({
        stories: paginatedStories,
        pagination: {
          total: stories.length,
          page,
          limit,
          totalPages
        }
      })
    };
  } catch (err) {
    logError(err, 'get-stories');
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Failed to fetch stories",
        message: err.message
      })
    };
  }
};

// Function to fetch stories from GitHub
async function fetchStoriesFromGitHub() {
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
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path,
      ref: branch
    });
    
    // Filter for markdown files
    const mdFiles = data.filter(file => file.name.endsWith('.md'));
    
    // Fetch the content of each file
    const stories = await Promise.all(
      mdFiles.map(async (file) => {
        const fileData = await octokit.repos.getContent({
          owner,
          repo,
          path: file.path,
          ref: branch
        });
        
        // Decode content from base64
        const content = Buffer.from(fileData.data.content, 'base64').toString();
        
        // Parse frontmatter
        const { data: frontmatter, content: storyContent } = matter(content);
        
        // Only return published stories
        if (frontmatter.published === false) {
          return null;
        }
        
        // Create a readable date format and calculate read time
        const readTime = calculateReadTime(storyContent);
        const date = formatDate(frontmatter.date);
        
        // Return formatted story data
        return {
          id: frontmatter.id || file.name.replace('.md', ''),
          title: frontmatter.title,
          companyName: frontmatter.companyName,
          industry: frontmatter.industry,
          fundingAmount: frontmatter.fundingAmount,
          failureReason: frontmatter.failureReason,
          summary: storyContent.substring(0, 160) + '...',
          date,
          readTime,
          upvotes: frontmatter.upvotes || 0,
          slug: file.name.replace('.md', '')
        };
      })
    );
    
    // Filter out null values (unpublished stories)
    return stories.filter(story => story !== null);
  } catch (err) {
    console.error("Error fetching stories from GitHub:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Failed to fetch stories from GitHub",
        message: err.message
      })
    };
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

// Remove getMockStories function as we'll only use real data