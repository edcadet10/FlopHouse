// This function will process form submissions and store them as Netlify CMS content
const slugify = require("slugify");

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
    
    // Create filename for the markdown file (now storing in submissions directory)
    const filename = `${slug}-${id}.md`;
    
    // Format content as markdown with frontmatter
    const content = formatAsMarkdown(data, id, timestamp, slug);
    
    // For development, just log and return success
    console.log("Would save file:", filename);
    console.log("Content:", content);
    
    // In production, we would save the file to a CMS or database
    console.log("Submission processed successfully!");
    
    // Return success response
    return {
      statusCode: 200,
      headers,
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