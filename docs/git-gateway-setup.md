# Setting Up Git Gateway for FlopHouse Submissions

The current submission system allows users to submit their stories, but there's an additional step needed to make these submissions appear in the Netlify CMS admin interface. We need to properly set up Git Gateway, which will allow the serverless functions to commit directly to your GitHub repository.

## What is Git Gateway?

Git Gateway is a Netlify feature that acts as a proxy between your site and your Git repository. It allows authenticated users to push content to your repository without needing direct Git access.

## Steps to Configure Git Gateway

1. **Enable Netlify Identity**:
   - Go to your Netlify site dashboard
   - Navigate to "Site settings" > "Identity"
   - Click "Enable Identity"
   
2. **Enable Git Gateway**:
   - Still in the Identity tab, scroll down to "Services" section
   - Find "Git Gateway" and click "Enable"
   - When prompted, connect to your GitHub repository

3. **Configure Identity Settings**:
   - Under Registration preferences, choose whether you want to allow open registration or invite-only
   - For a production site, "Invite only" is recommended
   - Add your email as the first invited user

4. **Update the Story Submission Function**:
   - The current serverless function receives submissions but doesn't store them in Git
   - To integrate with Git Gateway properly, you would need to:
     a. Authenticate with the Netlify Identity service
     b. Use the Git Gateway API to commit new submissions
     c. Handle potential conflicts and errors

## Advanced Implementation (Future Enhancement)

For a complete solution that writes submissions to the repository, you would need to modify the serverless function to:

1. Accept the submission data
2. Format it as a Markdown file
3. Use the Git Gateway JWT token to authenticate
4. Make an API call to create/update the file in the repository

This requires extending the current function with GitHub API calls and proper error handling.

## Current Workaround

Until the Git Gateway integration is completed, submissions will be stored as static files in the `content/submissions` directory but will require manual approval:

1. When a user submits a story, it is sent to the serverless function
2. The function processes and validates the data
3. An email notification could be sent to administrators (requires setup)
4. Admins can manually create the submission in the CMS

## Next Steps

1. Properly set up Netlify Identity for your site
2. Enable Git Gateway in the Netlify dashboard
3. Test the form submission
4. Consider implementing the advanced solution for automatic file creation

For more information, see the [Netlify CMS documentation](https://www.netlifycms.org/docs/git-gateway-backend/) and [Netlify Identity documentation](https://docs.netlify.com/visitor-access/identity/).
