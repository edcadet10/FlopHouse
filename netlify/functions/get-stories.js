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
    
    // Log request info
    console.log(`Processing request: page=${page}, limit=${limit}, industry=${industry}, reason=${failureReason}`);
    
    // Check GitHub token
    if (!process.env.GITHUB_TOKEN) {
      console.warn("GitHub token not configured, using fallback data");
      // Use fallback data instead of failing
      let stories = getFallbackStories();
      
      // Apply filters and return data
      return formatResponse(stories, industry, failureReason, page, limit);
    }
    
    // Fetch from GitHub
    let stories = await fetchStoriesFromGitHub();
    
    // Format and return response
    return formatResponse(stories, industry, failureReason, page, limit);
  } catch (err) {
    logError(err, 'get-stories');
    
    // Return fallback data on error
    console.log("Critical error in handler, using fallback data");
    let stories = getFallbackStories();
    
    return {
      statusCode: 200, // Return 200 with fallback data instead of 500
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60" // Short cache time for fallback data
      },
      body: JSON.stringify({
        stories: stories,
        pagination: {
          total: stories.length,
          page: 1,
          limit: stories.length,
          totalPages: 1
        },
        status: "fallback", // Indicate this is fallback data
        error: err.message
      })
    };
  }
};

// Helper function to format the response with filters and pagination
function formatResponse(stories, industry, failureReason, page, limit) {
  // Apply filters if needed
  if (industry) {
    stories = stories.filter(story => 
      story.industry && story.industry.toLowerCase() === industry.toLowerCase()
    );
  }
  
  if (failureReason) {
    stories = stories.filter(story => 
      story.failureReason && story.failureReason.toLowerCase() === failureReason.toLowerCase()
    );
  }
  
  // Sort by date, newest first (assuming date strings are comparable)
  stories = stories.sort((a, b) => {
    // Try to parse dates if they're not already Date objects
    const dateA = typeof a.date === 'string' ? new Date(a.date) : a.date;
    const dateB = typeof b.date === 'string' ? new Date(b.date) : b.date;
    
    // If parsing fails, fallback to string comparison
    if (isNaN(dateA) || isNaN(dateB)) {
      return a.date > b.date ? -1 : 1;
    }
    
    return dateB - dateA;
  });
  
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
}

// Function to fetch stories from GitHub
async function fetchStoriesFromGitHub() {
  try {
    // Create Octokit instance with GitHub token
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });
    
    // Repository details from environment variables
    const owner = process.env.GITHUB_OWNER || 'edcadet10';
    const repo = process.env.GITHUB_REPO || 'FlopHouse';
    const branch = process.env.GITHUB_BRANCH || 'main';  // Changed from 'content' to 'main'
    const path = 'content/stories';
    
    // Log environment variables for debugging (redacting token)
    console.log(`GitHub config: Owner=${owner}, Repo=${repo}, Branch=${branch}, Path=${path}, Token=${process.env.GITHUB_TOKEN ? 'Set' : 'Not Set'}`);
    
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
      console.log(`Found ${mdFiles.length} markdown files in stories directory`);
      
      // Fetch the content of each file
      const stories = await Promise.all(
        mdFiles.map(async (file) => {
          try {
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
            
            // Only return published stories if published flag exists
            if (frontmatter.published === false) {
              return null;
            }
            
            // Create a readable date format and calculate read time
            const readTime = calculateReadTime(storyContent);
            const date = formatDate(frontmatter.date || new Date().toISOString());
            
            // Return formatted story data
            return {
              id: frontmatter.id || file.name.replace('.md', ''),
              title: frontmatter.title || "Untitled Story",
              companyName: frontmatter.companyName || "Unknown Company",
              industry: frontmatter.industry || "Technology",
              fundingAmount: frontmatter.fundingAmount || "Not specified",
              failureReason: frontmatter.failureReason || "Multiple Factors",
              summary: storyContent.substring(0, 160) + '...',
              date,
              readTime,
              upvotes: frontmatter.upvotes || 0,
              slug: frontmatter.slug || file.name.replace('.md', '')
            };
          } catch (fileError) {
            console.error(`Error processing file ${file.path}:`, fileError);
            return null;
          }
        })
      );
      
      // Filter out null values (unpublished stories or errors)
      return stories.filter(story => story !== null);
    } catch (repoError) {
      console.error("Error accessing stories directory:", repoError);
      
      // If directory doesn't exist or other GitHub error, return fallback data
      return getFallbackStories();
    }
  } catch (err) {
    console.error("Critical error in fetchStoriesFromGitHub:", err);
    return getFallbackStories();
  }
}

// Fallback function to return demo stories if GitHub fetching fails
function getFallbackStories() {
  console.log("Using fallback stories due to GitHub API error");
  return [
    {
      id: "fallback1",
      title: "TaskMaster: What Went Wrong",
      companyName: "TaskMaster Inc.",
      industry: "SaaS",
      fundingAmount: "$1.2M",
      failureReason: "Lack of Product-Market Fit",
      summary: "A deep dive into how we misunderstood the market need and built features nobody wanted.",
      date: "3 days ago",
      readTime: "5 min read",
      upvotes: 24,
      slug: "taskmaster-what-went-wrong"
    },
    {
      id: "fallback2",
      title: "CodeBuddy: Our Journey to Shutdown",
      companyName: "CodeBuddy",
      industry: "Developer Tools",
      fundingAmount: "$800K",
      failureReason: "Business Model",
      summary: "We built a great product that developers loved, but our business model couldn't sustain growth.",
      date: "1 week ago",
      readTime: "7 min read",
      upvotes: 56,
      slug: "codebuddy-journey"
    },
    {
      id: "fallback3",
      title: "LaunchNow: Lessons from Our Failure",
      companyName: "LaunchNow",
      industry: "No-Code",
      fundingAmount: "$3.5M",
      failureReason: "Market Timing",
      summary: "Our no-code platform gained early traction but failed to convert free users to paying customers.",
      date: "2 weeks ago",
      readTime: "6 min read",
      upvotes: 32,
      slug: "launchnow-lessons"
    }
  ];
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