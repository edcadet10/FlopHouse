const { Octokit } = require("@octokit/rest");
const crypto = require("crypto");

// Add proper error logging
const logError = (err, context = '') => {
  console.error(`[${context}] ${err.message}`);
  console.error(err.stack);
};

exports.handler = async (event, context) => {
  // Only allow POST method
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  try {
    // Parse the submitted form data
    const formData = JSON.parse(event.body);
    const { name, email, subject, message } = formData;

    // Validate required fields
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Name, email, and message are required" })
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid email address" })
      };
    }

    // Check GitHub token
    if (!process.env.GITHUB_TOKEN) {
      console.warn("GitHub token not configured, unable to save contact message");
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: "Server configuration error. Please try again later." 
        })
      };
    }

    // Generate a unique ID for the message
    const id = crypto.randomBytes(8).toString('hex');
    const date = new Date().toISOString();
    
    // Format the filename with timestamp components
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const day = String(now.getUTCDate()).padStart(2, '0');
    const hour = String(now.getUTCHours()).padStart(2, '0');
    const minute = String(now.getUTCMinutes()).padStart(2, '0');
    const second = String(now.getUTCSeconds()).padStart(2, '0');
    
    const filename = `${year}-${month}-${day}-${hour}-${minute}-${second}.md`;

    // Create content in frontmatter format
    const content = `---
name: "${name.replace(/"/g, '\\"')}"
email: "${email}"
subject: "${subject ? subject.replace(/"/g, '\\"') : ''}"
message: "${message.replace(/"/g, '\\"').replace(/\n/g, "\\n")}"
date: "${date}"
read: false
---
`;

    // Create Octokit instance
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });

    // Repository details
    const owner = process.env.GITHUB_OWNER || 'edcadet10';
    const repo = process.env.GITHUB_REPO || 'FlopHouse';
    const branch = process.env.GITHUB_BRANCH || 'main';
    const path = `content/contact-messages/${filename}`;

    // Commit the message to GitHub
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: `Contact form submission from ${name}`,
      content: Buffer.from(content).toString('base64'),
      branch
    });

    // Success response
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Contact message submitted successfully"
      })
    };
  } catch (err) {
    logError(err, 'contact-form');
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "There was a problem submitting your message. Please try again." 
      })
    };
  }
};