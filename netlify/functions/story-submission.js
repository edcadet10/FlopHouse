// This function will process form submissions and store them in GitHub
const { Octokit } = require("@octokit/rest");
const slugify = require("slugify");

// Add proper error logging
const logError = (err, context = '') => {
  console.error(`[${context}] ${err.message}`);
  console.error(err.stack);
  // In a production setup, you could send this to a logging service
};

exports.handler = async (event, context) => {
  // Set CORS headers for preflight requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
      },
      body: ""
    };
  }
  
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return { 
      statusCode: 405, 
      headers: { "Content-Type": "application/json" },
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
      console.log("Successfully parsed submission data");
    } catch (parseError) {
      console.error("Error parsing submission data:", parseError);
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "Validation failed",
          details: validationErrors
        })
      };
    }

    // Add timestamp and generate ID
    const timestamp = new Date().toISOString();
    const id = generateId();
    const slug = slugify(data.title, { lower: true, strict: true });
    
    // Create filename for the markdown file
    const filename = `${slug}-${id}.md`;
    
    // Format content as markdown with frontmatter
    const content = formatAsMarkdown(data, id, timestamp);
    
    // Check GitHub token
    if (!process.env.GITHUB_TOKEN) {
      console.error("GitHub token not configured");
      
      // Return success but with a mock ID since we can't create the file
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Story submission received (DEMO MODE - not saved to GitHub)",
          id: id,
          slug: slug,
          timestamp: timestamp,
          demo: true
        })
      };
    }
    
    // Create the file in GitHub
    const result = await createFileInGitHub(filename, content);
    console.log("Successfully created file in GitHub:", result);
    
    return {
      statusCode: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        message: "Story submission received successfully",
        id,
        slug,
        timestamp
      })
    };
  } catch (err) {
    logError(err, 'story-submission');
    
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
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
function formatAsMarkdown(data, id, timestamp) {
  return `---
id: ${id}
title: "${data.title}"
companyName: "${data.companyName}"
industry: "${data.industry}"
fundingAmount: "${data.fundingAmount || 'Not specified'}"
failureReason: "${data.failureReason}"
date: "${timestamp}"
email: "${data.email || ''}"
published: true
slug: "${slugify(data.title, { lower: true, strict: true })}"
---

${data.story}

## Lessons Learned

${data.lessons || 'No lessons provided.'}
`;
}

// Helper function to create a file in GitHub
async function createFileInGitHub(filename, content) {
  try {
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });
    
    // Repository details from environment variables
    const owner = process.env.GITHUB_OWNER || 'edcadet10';
    const repo = process.env.GITHUB_REPO || 'FlopHouse';
    const branch = process.env.GITHUB_BRANCH || 'content';
    const path = `content/stories/${filename}`;
    
    console.log(`Creating file in GitHub: Path=${path}, Branch=${branch}`);
    
    // Create or update the file
    const response = await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: `Add new story: ${filename}`,
      content: Buffer.from(content).toString('base64'),
      branch
    });
    
    return response.data;
  } catch (err) {
    console.error("Error creating file in GitHub:", err);
    // Don't rethrow, just return an error object with useful info
    return {
      error: true,
      message: err.message,
      status: err.status
    };
  }
}

// Helper function to generate a unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
}