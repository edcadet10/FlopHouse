<img src="public/flophouse-banner.svg" alt="FlopHouse Banner" width="100%">

<div align="center">
  
# 🏚️ FlopHouse

**A curated sanctuary for failed startup stories.**

[![Netlify Status](https://img.shields.io/badge/Netlify-Deployed-00C7B7?logo=netlify&logoColor=white)](https://app.netlify.com/sites/flophouse/deploys)
[![GitHub Issues](https://img.shields.io/github/issues/edcadet10/FlopHouse)](https://github.com/edcadet10/FlopHouse/issues)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![NextJS](https://img.shields.io/badge/NextJS-14.1.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue)](https://www.typescriptlang.org/)

<p align="center">
  <b>Key Features</b> &nbsp;|&nbsp; 
  <b>Tech Stack</b> &nbsp;|&nbsp; 
  <b>Getting Started</b> &nbsp;|&nbsp; 
  <b>Workflows</b> &nbsp;|&nbsp; 
  <b>Architecture</b> &nbsp;|&nbsp; 
  <b>Deployment</b> &nbsp;|&nbsp; 
  <b>Learn More</b>
</p>

</div>

## 🌟 Overview

**FlopHouse** is an elegant platform where founders can share and learn from startup failures. Transforming setbacks into stepping stones, the platform helps entrepreneurs avoid common pitfalls by creating a knowledge repository of valuable lessons.

<div align="center">
  <img src="public/flophouse-mockup.svg" alt="FlopHouse Mockup" width="80%">
</div>

## ✨ Key Features

- **📝 Share Failed Startup Stories** — Submit your post-mortem in a structured, thoughtful format
- **🔍 Browse & Filter** — Explore stories by industry, failure reason, and more
- **💡 Knowledge Repository** — Learn from others' mistakes and insights
- **🎯 Focus on UX** — Clean, minimalist design highlighting content
- **⚡ Serverless Architecture** — Zero-cost, high-performance deployment
- **🔒 Secure Form Handling** — Netlify Forms integration with spam protection

## 🛠️ Tech Stack

<div align="center">
  
| Frontend | Backend | Deployment |
|:--------:|:-------:|:----------:|
| ![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white) | ![Netlify Functions](https://img.shields.io/badge/Netlify_Functions-00C7B7?style=for-the-badge&logo=netlify&logoColor=white) | ![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white) |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) | ![Serverless](https://img.shields.io/badge/Serverless-FD5750?style=for-the-badge&logo=serverless&logoColor=white) | ![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white) |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) | | |
| ![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white) | | |

</div>

## 💻 Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/edcadet10/FlopHouse.git

# Navigate to the project folder
cd FlopHouse

# Install dependencies
npm install

# Start the development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application in your browser.

## 🔄 Workflows

### Story Submission and Review Process

1. **User Submission**:
   - Users submit stories through the `/submit` form
   - Submissions are validated and processed by the `story-submission.js` Netlify function
   - Valid submissions are stored as markdown files in the `content/submissions` directory

2. **Admin Review**:
   - Admins access the Netlify CMS at `/admin` to review pending submissions
   - The CMS is configured with an editorial workflow that allows for draft/review/approval stages
   - Admins can edit, approve, or reject submissions

3. **Publication**:
   - Approved stories are moved to the `content/stories` directory with `published: true`
   - Published stories appear on the main site with proper categorization
   - The `get-stories.js` Netlify function retrieves published stories from GitHub

The project follows these UX design principles:

| Principle | Implementation |
|-----------|----------------|
| **Hick's Law** | Minimal actions per screen. All CTAs limited to 1–2 per context. |
| **Fitts's Law** | Primary touch targets ≥ 44px. Navigation placed close to thumb zones. |
| **Miller's Law** | Core workflows contain no more than 5–7 options at once. |
| **Jakob's Law** | Navigation, cards, dropdowns behave like standard web patterns. |
| **Law of Prägnanz** | Extreme white space, clear hierarchy, and few visual elements. |
| **Doherty Threshold** | Interactions complete <400ms; animation timing optimized; instant visual feedback. |

## 🏗️ Architecture

FlopHouse uses a modern, serverless architecture:

```
FlopHouse/
├── app/                  # Next.js app directory
│   ├── browse/           # Browse stories page
│   ├── submit/           # Submit story page
│   └── layout.tsx        # Root layout
├── components/           # Reusable UI components
│   ├── home/             # Homepage components
│   ├── ui/               # UI primitives
│   └── theme-provider.tsx # Dark mode handling
├── content/              # Content storage
│   └── stories/          # Markdown/JSON story files
├── lib/                  # Utility functions
├── netlify/              # Netlify serverless functions
│   └── functions/        # API endpoints
├── public/               # Static assets
└── styles/               # Global styles
```

## 🚀 Deployment

The application is automatically deployed to Netlify when changes are pushed to the main branch:

1. **Serverless Backend**: Netlify Functions handle dynamic operations like form submissions
2. **Static Frontend**: Next.js static export enables blazing-fast page loads
3. **Continuous Deployment**: GitHub Actions automate the deployment pipeline

### Environment Variables

Create a `.env.local` file with the following variables:

```
# Netlify
NETLIFY_AUTH_TOKEN=your_token
NETLIFY_SITE_ID=your_site_id
```

> **Note:** Never commit your `.env` files to Git.

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  
Made with ❤️ by [FlopHouse Team](https://github.com/edcadet10)

<img src="public/flophouse-logo.svg" alt="FlopHouse Logo" width="60">

</div>
