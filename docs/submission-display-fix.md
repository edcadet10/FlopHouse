# Submission Display Issue - Diagnosis and Fix

## Problem Description

Submissions were appearing with empty story content in the Netlify CMS admin dashboard, even though the content was actually present in the markdown files.

## Root Cause

The issue was caused by Netlify CMS creating a complex nested data structure when editing files, rather than maintaining the simple markdown format. This happened when:

1. Files were created via API (using the story-submission Netlify function)
2. Then edited through the Netlify CMS admin interface
3. CMS would add metadata like `partial`, `path`, `meta`, `isModification`, `raw`, `data`, etc.
4. This complex structure confused the CMS display logic

## Files Affected

- `/content/submissions/petpal-how-our-pet-sitting-marketplace-failed-to-scale.md` (fixed)

## Fixes Applied

### 1. Immediate Fix ✅
- Rewrote the malformed submission file in proper markdown format
- Content is now visible in the admin dashboard

### 2. Preventive Fixes ✅

#### Updated Story Submission Function
- **File**: `netlify/functions/story-submission.js`
- **Changes**: 
  - Improved YAML frontmatter escaping
  - Combined story and lessons into single `body` field
  - Added `approve: pending` field for workflow

#### Created Utility Script
- **File**: `scripts/fix-submissions.js`
- **Purpose**: Automatically fix any future malformed submissions
- **Usage**: `npm run fix-submissions`

#### Added NPM Script
- **File**: `package.json`
- **Addition**: `"fix-submissions": "node scripts/fix-submissions.js"`

## How to Prevent This in the Future

### 1. Monitor File Structure
Check submission files occasionally to ensure they maintain proper markdown format:

```bash
# Check if any files have the complex structure
grep -r "raw: >" content/submissions/
grep -r "data:" content/submissions/
```

### 2. Run Fix Script When Needed
If malformed files are detected:

```bash
npm run fix-submissions
```

### 3. Consider Alternative Approaches
For future development, consider:

- Using Netlify CMS's built-in webhook for processing submissions
- Creating a custom editorial workflow that doesn't require manual CMS editing
- Using Git-based workflow for approvals instead of CMS editing

## Technical Details

### Expected File Format
```markdown
---
id: example123
title: "Example Title"
companyName: "Example Corp"
industry: "saas"
# ... other frontmatter fields
---

# Story content here

This is the main story content...

## Lessons Learned

Key takeaways...
```

### Problematic Format (Fixed)
```markdown
---
partial: false
path: content/submissions/example.md
meta:
  path: content/submissions/example.md
raw: >
  ---
  id: example123
  # ... nested structure
data:
  body: >
    # Story content here
  # ... complex nested data
---
```

## Testing

To verify the fix works:

1. Go to admin dashboard: `/admin/#/collections/submissions`
2. Open the PetPal submission
3. Verify the story content is visible in the "Story" field
4. Check that all form fields are populated correctly

## Monitoring

Set up alerts or regular checks for:
- Files containing `raw: >` in submissions directory
- Files with complex nested structures
- Empty story content in CMS interface

---

**Status**: ✅ **RESOLVED**  
**Date**: May 21, 2025  
**Impact**: Story content now displays correctly in admin dashboard