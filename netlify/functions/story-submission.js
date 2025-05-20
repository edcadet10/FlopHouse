// This function will process form submissions and store them as Netlify CMS content
const slugify = require("slugify");
const fetch = require("node-fetch");
const { Base64 } = require("js-base64");

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
  
  // Set CORS headers for preflight requests
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
    // Log the incoming request
    console.log("Received submission request");
    
    // Parse the form data
    let data;
    try {
      data = JSON.parse(event.body);
      console.log("Successfully parsed submission data:", JSON.stringify(data));
    } catch (parseError) {
      console.error("Error parsing submission data:", parseError);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Invalid JSON format",
          details: parseError.message
        })
      };
    }
    
    // Enhanced validation with detailed errors
    const validationErrors = validateSubmission(data);
    if (validationErrors.length > 0) {
      console.error("Validation errors:", validationErrors);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Validation failed",
          details: validationErrors
        })
      };
    }

    // Add timestamp and generate ID
    const timestamp = new Date().toISOString();
    const id = generateId();
    
    // Use slugify safely with fallback
    let slug;
    try {
      slug = data.title ? slugify(data.title, { lower: true, strict: true }) : `story-${id}`;
    } catch (slugError) {
      console.error("Error creating slug:", slugError);
      slug = `story-${id}`;
    }
    
    // Create filename for the markdown file
    const filename = `${slug}.md`;
    
    // Format content as markdown with frontmatter
    const content = formatAsMarkdown(data, id, timestamp, slug);
    
    // Store the submission in GitHub
    try {
      await saveSubmissionToGitHub(filename, content);
      console.log("Successfully saved submission to GitHub:", filename);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: "Story submission received successfully and saved for review",
          id,
          slug,
          timestamp
        })
      };
    } catch (githubError) {
      console.error("Error saving to GitHub:", githubError);
      // If GitHub storage fails, still acknowledge receipt but note the error
      return {
        statusCode: 202, // Accepted, but not fully processed
        headers,
        body: JSON.stringify({
          message: "Story submission received but could not be saved for review. Admin has been notified.",
          id,
          slug,
          timestamp,
          warning: "Submission was not automatically saved to the review queue."
        })
      };
    }
  } catch (err) {
    logError(err, 'story-submission');
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: "Failed to process submission",
        message: err.message
      })
    };
  }
};

// Enhanced validation function
function validateSubmission(data) {
  const errors = [];
  
  // Required fields validation
  if (!data.title || data.title.trim() === '') {
    errors.push("Title is required");
  }
  
  if (!data.companyName || data.companyName.trim() === '') {
    errors.push("Company name is required");
  }
  
  if (!data.industry || data.industry.trim() === '') {
    errors.push("Industry is required");
  }
  
  if (!data.failureReason || data.failureReason.trim() === '') {
    errors.push("Failure reason is required");
  }
  
  if (!data.story || data.story.trim() === '') {
    errors.push("Story content is required");
  }
  
  // Email validation if provided
  if (data.email && !isValidEmail(data.email)) {
    errors.push("Invalid email format");
  }
  
  // Length validations
  if (data.title && data.title.length > 100) {
    errors.push("Title must be less than 100 characters");
  }
  
  if (data.companyName && data.companyName.length > 50) {
    errors.push("Company name must be less than 50 characters");
  }
  
  return errors;
}

// Helper function to validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Helper function to format data as markdown with frontmatter
function formatAsMarkdown(data, id, timestamp, slug) {
  return `---
id: ${id}
title: "${data.title}"
companyName: "${data.companyName}"
industry: "${data.industry}"
fundingAmount: "${data.fundingAmount || 'Not specified'}"
failureReason: "${data.failureReason}"
date: "${timestamp}"
email: "${data.email || ''}"
published: false
slug: "${slug}"
---

${data.story}

## Lessons Learned

${data.lessons || 'No lessons provided.'}
`;
}

// Helper function to generate a unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
}

// Function to save the submission to GitHub
async function saveSubmissionToGitHub(filename, content) {
  try {
    // Use GitHub token from environment variables
    if (!process.env.GITHUB_TOKEN) {
      throw new Error('GitHub token not configured. Please set GITHUB_TOKEN environment variable in Netlify.');
    }
    
    // Repository details from environment variables
    const owner = process.env.GITHUB_OWNER || 'edcadet10';
    const repo = process.env.GITHUB_REPO || 'FlopHouse';
    const branch = process.env.GITHUB_BRANCH || 'main';
    const path = `content/submissions/${filename}`;
    
    console.log(`Attempting to save to: ${owner}/${repo}/${path} on branch ${branch}`);
    
    // Create a base64 encoded content
    const encodedContent = Base64.encode(content);
    
    // Use GitHub API to create a new file
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'FlopHouse-Netlify-Function'
      },
      body: JSON.stringify({
        message: `New story submission: ${filename}`,
        content: encodedContent,
        branch
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to create file: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
    }
    
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error in saveSubmissionToGitHub:', error);
    throw error;
  }
}