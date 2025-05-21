// Custom script to handle submission approvals
if (window.CMS) {
  // Wait for CMS to initialize
  window.CMS.registerEventListener({
    name: 'preSave',
    handler: async ({ entry }) => {
      // Only process submissions collection
      const collection = entry.get('collection');
      if (collection !== 'submissions') {
        return entry;
      }

      // Check if this is an approval action
      const approvalAction = entry.getIn(['data', 'approve']);
      if (approvalAction !== 'approve') {
        // Just a normal save, no special handling needed
        return entry;
      }

      try {
        // Get the current data
        const data = entry.get('data').toJS();
        const slug = data.slug;
        
        // Set as published
        data.published = true;
        
        // Remove the approval field as it's not needed in the published version
        delete data.approve;
        
        // Generate the markdown content
        let content = '---\n';
        Object.keys(data).forEach(key => {
          if (key === 'body' || key === 'lessons') return; // Skip these for frontmatter
          
          // Format values properly
          let value = data[key];
          if (typeof value === 'string' && (value.includes(':') || value.includes('"'))) {
            value = `"${value.replace(/"/g, '\\"')}"`;
          } else if (typeof value === 'boolean') {
            value = value ? 'true' : 'false';
          }
          
          content += `${key}: ${value}\n`;
        });
        content += '---\n\n';
        content += data.body || '';
        
        if (data.lessons) {
          content += '\n\n## Lessons Learned\n\n';
          content += data.lessons;
        }
        
        console.log('Publishing story:', slug);
        
        // Call our Netlify function to publish the story
        const response = await fetch('/.netlify/functions/publish-story', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            slug: slug,
            content: content
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to publish: ${errorData.error || errorData.message || 'Unknown error'}`);
        }
        
        const responseData = await response.json();
        console.log('Publish success:', responseData);
        
        // Let the user know it worked
        alert('Story approved and published successfully!');
        
        // Redirect to the stories collection
        setTimeout(() => {
          window.location.href = '/admin/#/collections/stories';
        }, 1000);
        
        // Continue with the normal save
        return entry;
      } catch (error) {
        console.error('Error publishing story:', error);
        alert(`Error publishing story: ${error.message}`);
        return entry;
      }
    }
  });
}