// This function will process form submissions and store them in GitHub
const { Octokit } = require("@octokit/rest");
const slugify = require("slugify");

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  
  try {
    // Parse the form data
    const data = JSON.parse(event.body);
    
    // Basic validation
    if (!data.title || !data.companyName || !data.industry || !data.failureReason || !data.story) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Missing required fields",
          requiredFields: ["title", "companyName", "industry", "failureReason", "story"]
        })
      };
    }

    // Optional validation for email
    if (data.email && !isValidEmail(data.email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Invalid email format"
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
    
    // If this is a production environment and GITHUB_TOKEN is set,
    // actually create the file in GitHub
    if (process.env.GITHUB_TOKEN) {
      await createFileInGitHub(filename, content);
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Story submission received successfully",
        id,
        slug,
        timestamp
      })
    };
  } catch (err) {
    console.error("Error processing submission:", err);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Failed to process submission",
        message: err.message
      })
    };
  }
};

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
published: false
---

${data.story}

## Lessons Learned

${data.lessons || 'No lessons provided.'}
`;
}

// Helper function to create a file in GitHub
async function createFileInGitHub(filename, content) {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
  });
  
  // Repository details from environment variables
  const owner = process.env.GITHUB_OWNER || 'edcadet10';
  const repo = process.env.GITHUB_REPO || 'FlopHouse';
  const branch = process.env.GITHUB_BRANCH || 'content';
  const path = `content/stories/${filename}`;
  
  try {
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
    throw err;
  }
}

// Helper function to validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Helper function to generate a unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
}