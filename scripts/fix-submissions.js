#!/usr/bin/env node

/**
 * Script to fix malformed submission files that contain
 * complex Netlify CMS metadata structures
 */

const fs = require('fs');
const path = require('path');

const SUBMISSIONS_DIR = path.join(__dirname, '..', 'content', 'submissions');

function extractDataFromComplexFile(content) {
  try {
    // Try to parse the complex structure
    const lines = content.split('\n');
    let insideRaw = false;
    let rawContent = '';
    let inFrontmatter = false;
    let frontmatterContent = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Look for the start of raw content
      if (line.trim() === 'raw: >') {
        insideRaw = true;
        continue;
      }
      
      // Look for data section start
      if (line.trim() === 'data:') {
        break; // We'll extract from the data section instead
      }
      
      // If we're inside raw content
      if (insideRaw) {
        if (line.startsWith('  ') || line.trim() === '') {
          // This is part of the raw content (indented or empty)
          rawContent += line.substring(2) + '\n'; // Remove 2-space indent
        } else {
          // We've reached the end of raw content
          break;
        }
      }
    }
    
    // If we found raw content, parse the frontmatter from it
    if (rawContent.trim()) {
      const rawLines = rawContent.split('\n');
      let currentlyInFrontmatter = false;
      let bodyStart = -1;
      
      for (let i = 0; i < rawLines.length; i++) {
        const line = rawLines[i];
        
        if (line.trim() === '---') {
          if (!currentlyInFrontmatter) {
            currentlyInFrontmatter = true;
            continue;
          } else {
            // End of frontmatter
            bodyStart = i + 1;
            break;
          }
        }
        
        if (currentlyInFrontmatter) {
          frontmatterContent += line + '\n';
        }
      }
      
      // Extract body content
      let bodyContent = '';
      if (bodyStart >= 0) {
        bodyContent = rawLines.slice(bodyStart).join('\n').trim();
      }
      
      return {
        frontmatter: frontmatterContent.trim(),
        body: bodyContent
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting data:', error);
    return null;
  }
}

function fixSubmissionFile(filePath) {
  try {
    console.log(`Processing ${filePath}...`);
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if this file has the complex structure
    if (!content.includes('raw: >') && !content.includes('data:')) {
      console.log(`  File appears to be already in correct format.`);
      return false;
    }
    
    // Extract the proper data
    const extracted = extractDataFromComplexFile(content);
    
    if (!extracted) {
      console.log(`  Could not extract data from file.`);
      return false;
    }
    
    // Reconstruct the file in simple format
    const newContent = `---\n${extracted.frontmatter}\n---\n\n${extracted.body}`;
    
    // Write the fixed content
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`  ✅ Fixed successfully.`);
    return true;
  } catch (error) {
    console.error(`  ❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  console.log('🔧 Fixing malformed submission files...\n');
  
  if (!fs.existsSync(SUBMISSIONS_DIR)) {
    console.error(`Submissions directory not found: ${SUBMISSIONS_DIR}`);
    process.exit(1);
  }
  
  const files = fs.readdirSync(SUBMISSIONS_DIR)
    .filter(file => file.endsWith('.md'))
    .map(file => path.join(SUBMISSIONS_DIR, file));
  
  if (files.length === 0) {
    console.log('No submission files found.');
    return;
  }
  
  let fixedCount = 0;
  let totalCount = files.length;
  
  for (const file of files) {
    if (fixSubmissionFile(file)) {
      fixedCount++;
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`  Total files processed: ${totalCount}`);
  console.log(`  Files fixed: ${fixedCount}`);
  console.log(`  Files already correct: ${totalCount - fixedCount}`);
  
  if (fixedCount > 0) {
    console.log('\n✨ All malformed files have been fixed!');
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  extractDataFromComplexFile,
  fixSubmissionFile
};