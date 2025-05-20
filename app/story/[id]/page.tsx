// Story interface
interface Story {
  id: string;
  title: string;
  companyName: string;
  industry: string;
  fundingAmount: string;
  failureReason: string;
  content: string;
  contentHtml: string;
  date: string;
  readTime: string;
  upvotes: number;
  slug: string;
}

// This function is required for static site generation with dynamic routes
export async function generateStaticParams() {
  // Generate static paths for all our known story IDs
  // This ensures these pages will be pre-rendered at build time
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: 'placeholder' },
    // Add any other known story IDs here
  ]
}

// Use a client component for the interactive parts
import StoryClient from './story-client'

export default function StoryPage({ params }: { params: { id: string } }) {
  return <StoryClient params={params} />
}