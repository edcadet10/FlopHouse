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
  // For static export, we'll include the stories we know about
  // and rely on client-side fetching for others
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: 'placeholder' },
    { id: 'dhjkhlhjkg' },
    { id: 'tetttttt' },
    { id: 'fsadrewqadsar' }
    // Real stories from content/stories directory
  ]
}

// Use a client component for the interactive parts
import StoryClient from './story-client'

export default function StoryPage({ params }: { params: { id: string } }) {
  return <StoryClient params={params} />
}