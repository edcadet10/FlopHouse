// Custom script to add delete functionality to the Netlify CMS admin interface
(function() {
  // Wait for CMS to initialize
  if (window.CMS) {
    // Register a custom preview template for stories and submissions
    window.CMS.registerPreviewTemplate(['stories', 'submissions'], ({ entry, widgetsFor, getAsset }) => {
      // Get the current collection and entry data
      const collection = entry.get('collection');
      const slug = entry.getIn(['data', 'slug']);
      
      // Add a small delay to make sure the preview is rendered
      setTimeout(() => {
        // Check if our delete button already exists
        if (!document.getElementById('custom-delete-button')) {
          // Create a delete button
          const deleteButton = document.createElement('button');
          deleteButton.id = 'custom-delete-button';
          deleteButton.className = 'cms-btn-delete';
          deleteButton.innerHTML = 'Delete Item';
          deleteButton.style.backgroundColor = '#e53e3e';
          deleteButton.style.color = 'white';
          deleteButton.style.padding = '8px 16px';
          deleteButton.style.border = 'none';
          deleteButton.style.borderRadius = '4px';
          deleteButton.style.cursor = 'pointer';
          deleteButton.style.marginTop = '16px';
          
          // Add click handler
          deleteButton.addEventListener('click', async (event) => {
            event.preventDefault();
            
            // Confirm the deletion
            if (!confirm(`Are you sure you want to delete this ${collection} item?`)) {
              return;
            }
            
            try {
              // Call our Netlify function to delete the item
              const response = await fetch('/.netlify/functions/delete-story', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  collection: collection,
                  slug: slug
                })
              });
              
              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || errorData.message || 'Failed to delete item');
              }
              
              // Show success message
              alert(`Item deleted successfully!`);
              
              // Redirect to the collection list
              window.location.href = `/admin/#/collections/${collection}`;
            } catch (error) {
              console.error('Error deleting item:', error);
              alert(`Error deleting item: ${error.message}`);
            }
          });
          
          // Find the control panel in the CMS interface
          const controlPanels = document.querySelectorAll('.cms-editor-control');
          if (controlPanels.length > 0) {
            // Append the button to the last control panel
            const lastPanel = controlPanels[controlPanels.length - 1];
            lastPanel.appendChild(deleteButton);
          } else {
            // If control panels not found, try to append to the editor container
            const editorContainer = document.querySelector('.cms-editor-container');
            if (editorContainer) {
              editorContainer.appendChild(deleteButton);
            }
          }
        }
      }, 500);
      
      // Return null to use the default preview
      return null;
    });
    
    console.log('Custom delete functionality added to CMS');
  }
})();