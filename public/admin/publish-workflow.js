// Wait for CMS to initialize
if (window.CMS) {
  window.CMS.registerEventListener({
    name: 'preSave',
    handler: async ({ entry }) => {
      const collection = entry.get('collection');
      if (collection !== 'submissions') {
        return entry;
      }

      const approvalAction = entry.getIn(['data', 'approve']);
      if (approvalAction !== 'approve') {
        return entry;
      }

      try {
        const data = entry.get('data').toJS();
        const slug = data.slug;
        
        data.published = true;
        delete data.approve;
        
        // Generate content for display purposes
        console.log('Processing submission approval for:', slug);
        
        alert('Story marked for publishing!');
        
        // Continue with the normal save
        return entry;
      } catch (error) {
        console.error('Error in workflow:', error);
        alert(`Error: ${error.message}`);
        return entry;
      }
    }
  });
}