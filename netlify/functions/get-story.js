// This function retrieves a single story by ID or slug
const { Octokit } = require("@octokit/rest");
const matter = require("gray-matter");
const marked = require("marked");

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
    
    // Try to fetch the story from GitHub if token is available
    let story = null;
    
    if (process.env.GITHUB_TOKEN) {
      story = await fetchStoryFromGitHub(storyId);
    }
    
    // If not found in GitHub, try to find in mock data
    if (!story) {
      story = getMockStory(storyId);
    }
    
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
    console.error("Error fetching story:", err);
    
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
    
    // Find the file with the matching ID or slug
    const file = files.find(file => 
      file.name.includes(storyId) || 
      file.name.startsWith(`${storyId}.`) || 
      file.name.endsWith(`-${storyId}.md`)
    );
    
    if (!file) {
      return null;
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
    
    // Only return published stories
    if (frontmatter.published === false) {
      return null;
    }
    
    // Convert markdown to HTML
    const contentHtml = marked.parse(storyContent);
    
    // Create readable date format and calculate read time
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
      content: storyContent,
      contentHtml,
      date,
      readTime,
      upvotes: frontmatter.upvotes || 0,
      slug: file.name.replace('.md', '')
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

// Function to get a mock story
function getMockStory(storyId) {
  const mockStories = [
    {
      id: "1",
      title: "TaskMaster: What Went Wrong",
      companyName: "TaskMaster Inc.",
      industry: "SaaS",
      fundingAmount: "$1.2M",
      failureReason: "Lack of Product-Market Fit",
      content: "A deep dive into how we misunderstood the market need and built features nobody wanted.\n\n## The Beginning\n\nWe started TaskMaster with a simple mission: help teams manage tasks better. We raised a $1.2M seed round and assembled a team of 6 engineers.\n\n## Where We Went Wrong\n\nWe built features we thought users would want, without validating our assumptions. We spent 8 months building an AI-powered task prioritization system, only to find out most users just wanted simple kanban boards.\n\n## Lessons Learned\n\n1. Talk to users before building features\n2. Launch with a minimal viable product\n3. Focus on solving one problem really well",
      contentHtml: "<p>A deep dive into how we misunderstood the market need and built features nobody wanted.</p>\n<h2>The Beginning</h2>\n<p>We started TaskMaster with a simple mission: help teams manage tasks better. We raised a $1.2M seed round and assembled a team of 6 engineers.</p>\n<h2>Where We Went Wrong</h2>\n<p>We built features we thought users would want, without validating our assumptions. We spent 8 months building an AI-powered task prioritization system, only to find out most users just wanted simple kanban boards.</p>\n<h2>Lessons Learned</h2>\n<ol>\n<li>Talk to users before building features</li>\n<li>Launch with a minimal viable product</li>\n<li>Focus on solving one problem really well</li>\n</ol>",
      date: "3 days ago",
      readTime: "5 min read",
      upvotes: 24,
      slug: "taskmaster-what-went-wrong"
    },
    {
      id: "2",
      title: "CodeBuddy: Our Journey to Shutdown",
      companyName: "CodeBuddy",
      industry: "Developer Tools",
      fundingAmount: "$800K",
      failureReason: "Business Model",
      content: "We built a great product that developers loved, but our business model couldn't sustain growth.\n\n## The Product\n\nCodeBuddy was an AI-powered code review tool that integrated with GitHub and provided real-time feedback on code quality, security vulnerabilities, and performance issues.\n\n## The Problem\n\nDevelopers loved our free tier, but we struggled to convert them to paying customers. Our pricing model didn't align with the value we provided.\n\n## Lessons Learned\n\n1. Validate willingness to pay early on\n2. Build a business model that aligns with user value\n3. Focus on enterprise sales earlier",
      contentHtml: "<p>We built a great product that developers loved, but our business model couldn't sustain growth.</p>\n<h2>The Product</h2>\n<p>CodeBuddy was an AI-powered code review tool that integrated with GitHub and provided real-time feedback on code quality, security vulnerabilities, and performance issues.</p>\n<h2>The Problem</h2>\n<p>Developers loved our free tier, but we struggled to convert them to paying customers. Our pricing model didn't align with the value we provided.</p>\n<h2>Lessons Learned</h2>\n<ol>\n<li>Validate willingness to pay early on</li>\n<li>Build a business model that aligns with user value</li>\n<li>Focus on enterprise sales earlier</li>\n</ol>",
      date: "1 week ago",
      readTime: "7 min read",
      upvotes: 56,
      slug: "codebuddy-our-journey-to-shutdown"
    }
  ];
  
  return mockStories.find(story => 
    story.id === storyId || 
    story.slug === storyId
  );
}