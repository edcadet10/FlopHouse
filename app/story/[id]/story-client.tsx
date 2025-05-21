"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"
import { TrendingUp, Zap, ArrowLeft, FileText, Flame, ThumbsUp, AlertCircle, MessageCircle, Send } from "lucide-react"
import { useStoryFetcher, Story } from "@/lib/story-fetcher"
import IdentityModal from "@/components/auth/identity-modal"
import NetlifyIdentityWidget from 'netlify-identity-widget'

// Comment interface
interface Comment {
  id: string;
  name: string;
  comment: string;
  date: string;
}

// Format comment date
function formatCommentDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

// Story client component
export default function StoryClient({ params }: { params: { id: string } }) {
  // Use the story fetcher hook
  const { story, loading, error } = useStoryFetcher(params.id);
  
  const [upvoting, setUpvoting] = useState(false)
  const [upvoted, setUpvoted] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  // Comments state
  const [comments, setComments] = useState<Comment[]>([])
  const [loadingComments, setLoadingComments] = useState(false)
  const [commentName, setCommentName] = useState("")
  const [commentText, setCommentText] = useState("")
  const [submittingComment, setSubmittingComment] = useState(false)
  const [commentError, setCommentError] = useState<string | null>(null)
  
  // Check if Netlify Identity is available and if user is authenticated
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = NetlifyIdentityWidget.currentUser();
      setIsAuthenticated(!!user);
      
      // Set up event listeners
      const handleLogin = () => {
        setIsAuthenticated(true);
        setShowAuthModal(false);
      };
      
      const handleLogout = () => {
        setIsAuthenticated(false);
      };
      
      NetlifyIdentityWidget.on('login', handleLogin);
      NetlifyIdentityWidget.on('logout', handleLogout);
      
      return () => {
        NetlifyIdentityWidget.off('login', handleLogin);
        NetlifyIdentityWidget.off('logout', handleLogout);
      };
    }
  }, []);
  
  useEffect(() => {
    // Check if user has upvoted this story before
    if (typeof window !== 'undefined' && story) {
      const upvotedStories = localStorage.getItem('upvotedStories');
      if (upvotedStories) {
        try {
          const upvotedList = JSON.parse(upvotedStories);
          if (Array.isArray(upvotedList) && story.id) {
            setUpvoted(upvotedList.includes(story.id));
          }
        } catch (err: unknown) {
          console.error('Error parsing upvoted stories:', err);
        }
      }
      
      // Load comments for this story
      loadComments();
    }
  }, [story]);
  
  // Load comments for this story
  const loadComments = async () => {
    if (!story) return;
    
    try {
      setLoadingComments(true);
      
      const response = await fetch(`/.netlify/functions/story-comments/${story.id}`);
      
      if (!response.ok) {
        throw new Error(`Error loading comments: ${response.status}`);
      }
      
      const data = await response.json();
      setComments(data.comments || []);
      setCommentError(null);
    } catch (err: unknown) {
      console.error("Failed to load comments:", err);
      setCommentError("Failed to load comments. Please try again later.");
    } finally {
      setLoadingComments(false);
    }
  };
  
  // Handle comment submission
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!story) return;
    
    if (!commentName.trim() || !commentText.trim()) {
      setCommentError("Name and comment are required");
      return;
    }
    
    try {
      setSubmittingComment(true);
      setCommentError(null);
      
      const response = await fetch(`/.netlify/functions/story-comments/${story.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: commentName,
          comment: commentText
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit comment");
      }
      
      // Reset form fields
      setCommentName("");
      setCommentText("");
      
      // Reload comments
      await loadComments();
    } catch (err: unknown) {
      console.error("Failed to submit comment:", err);
      if (err instanceof Error) {
        setCommentError(err.message);
      } else {
        setCommentError("Failed to submit comment. Please try again later.");
      }
    } finally {
      setSubmittingComment(false);
    }
  };
  
  // Handle upvote
  const handleUpvote = async () => {
    if (upvoted || !story) return;
    
    // If not authenticated, show auth modal
    if (!isAuthenticated && typeof window !== 'undefined') {
      setShowAuthModal(true);
      return;
    }
    
    setUpvoting(true);
    
    try {
      // Update local state immediately for responsive UI
      setUpvoted(true);
      
      // Store in localStorage as a fallback
      if (typeof window !== 'undefined' && story.id) {
        try {
          const upvotedStories = localStorage.getItem('upvotedStories');
          const upvotedList = upvotedStories ? JSON.parse(upvotedStories) : [];
          if (Array.isArray(upvotedList)) {
            localStorage.setItem('upvotedStories', JSON.stringify([...upvotedList, story.id]));
          } else {
            localStorage.setItem('upvotedStories', JSON.stringify([story.id]));
          }
        } catch (err: unknown) {
          console.error('Error storing upvoted stories:', err);
          localStorage.setItem('upvotedStories', JSON.stringify([story.id]));
        }
      }
      
      // Call API with auth token if available
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        };
        
        // Add authorization header if authenticated
        if (typeof window !== 'undefined') {
          const user = NetlifyIdentityWidget.currentUser();
          if (user) {
            const token = await user.jwt();
            headers['Authorization'] = `Bearer ${token}`;
          }
        }
        
        await fetch('/.netlify/functions/upvote-story', {
          method: 'POST',
          headers,
          body: JSON.stringify({ storyId: story.id })
        });
      } catch (error) {
        console.error('Error calling API:', error);
        // We already updated the UI, so no need to show an error
      }
    } catch (err: unknown) {
      console.error('Error upvoting:', err);
    } finally {
      setUpvoting(false);
    }
  };
  
  // Handle authenticated upvote after successful login
  const handleAuthSuccess = () => {
    // Proceed with upvote after authentication
    if (story && !upvoted) {
      handleUpvote();
    }
  };
  
  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen">
        <div className="container px-4 py-12 mx-auto max-w-4xl">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        </div>
      </main>
    );
  }
  
  // Error state
  if (error) {
    return (
      <main className="min-h-screen">
        <div className="container px-4 py-12 mx-auto max-w-4xl">
          <div className="bg-muted/30 border border-red-500/20 rounded-lg p-12 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-medium text-white mb-2">Something went wrong</h2>
            <p className="text-zinc-400 mb-6">{error}</p>
            <Button asChild>
              <Link href="/browse">
                Browse Other Stories
              </Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }
  
  // No story found
  if (!story) {
    return (
      <main className="min-h-screen">
        <div className="container px-4 py-12 mx-auto max-w-4xl">
          <div className="bg-muted/30 border border-white/10 rounded-lg p-12 text-center">
            <FileText className="h-12 w-12 text-zinc-500 mx-auto mb-4" />
            <h2 className="text-2xl font-medium text-white mb-2">Story Not Found</h2>
            <p className="text-zinc-400 mb-6">The story you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link href="/browse">
                Browse Available Stories
              </Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }
  
  return (
    <main className="min-h-screen">
      <div className="container px-4 py-12 mx-auto max-w-4xl">
        {/* Header with breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-4">
            <Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/browse" className="hover:text-cyan-400 transition-colors">Browse</Link>
            <span>/</span>
            <span className="text-zinc-300">{story.title}</span>
          </div>
          
          <Link href="/browse" className="inline-flex items-center text-sm text-zinc-400 hover:text-cyan-400 transition-colors mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to all stories
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {story.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-3 md:gap-6 text-sm mb-6">
            <div className="px-3 py-1 bg-white/5 rounded-full text-cyan-300 border border-cyan-500/20 flex items-center">
              <Zap className="h-3 w-3 mr-1" />
              {story.industry}
            </div>
            
            <div className="px-3 py-1 bg-white/5 rounded-full text-cyan-300 border border-cyan-500/20 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              {story.fundingAmount}
            </div>
            
            <div className="px-3 py-1 bg-white/5 rounded-full text-cyan-300 border border-cyan-500/20 flex items-center">
              <Flame className="h-3 w-3 mr-1" />
              {story.failureReason}
            </div>
            
            <div className="text-zinc-400">
              <span className="mr-4">{story.companyName}</span>
              <span className="mr-4">•</span>
              <span className="mr-4">{story.date}</span>
              <span>{story.readTime}</span>
            </div>
          </div>
        </div>
        
        {/* Story content */}
        <div className="bg-muted/30 backdrop-blur-sm border border-white/10 rounded-lg p-6 md:p-8 mb-8">
          <div className="prose prose-invert prose-cyan max-w-none">
            <div dangerouslySetInnerHTML={{ __html: story.contentHtml }} />
          </div>
        </div>
        
        {/* Engagement footer */}
        <div className="bg-muted/30 backdrop-blur-sm border border-white/10 rounded-lg p-6 flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex items-center">
            <Button 
              variant={upvoted ? "default" : "outline"}
              size="sm"
              className={upvoted ? "cursor-default" : ""}
              onClick={handleUpvote}
              disabled={upvoting || upvoted}
            >
              <ThumbsUp className="h-4 w-4 mr-2" />
              {upvoted ? "Upvoted" : "Upvote"} • {story.upvotes}
            </Button>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-3 text-zinc-400 text-sm">
            <span>Help others learn from your failures</span>
            <Button asChild size="sm">
              <Link href="/submit">
                Share Your Story
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Comments section */}
        <div className="bg-muted/30 backdrop-blur-sm border border-white/10 rounded-lg p-6 md:p-8 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
            <MessageCircle className="h-5 w-5 mr-2 text-cyan-500" />
            Comments {comments.length > 0 && `(${comments.length})`}
          </h2>
          
          {/* Comment form */}
          <form onSubmit={handleSubmitComment} className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  className="w-full h-10 px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                  placeholder="Enter your name"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="comment" className="block text-sm font-medium text-zinc-300 mb-1">
                Your Comment
              </label>
              <textarea
                id="comment"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                rows={4}
                placeholder="Share your thoughts..."
              />
            </div>
            
            {commentError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-400 text-sm">
                {commentError}
              </div>
            )}
            
            <Button 
              type="submit" 
              disabled={submittingComment || !commentName.trim() || !commentText.trim()}
              className="flex items-center"
            >
              {submittingComment ? (
                <>
                  <span className="h-4 w-4 mr-2 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Post Comment
                </>
              )}
            </Button>
          </form>
          
          {/* Comments list */}
          {loadingComments ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-cyan-300">{comment.name}</span>
                    <span className="text-xs text-zinc-500">{formatCommentDate(comment.date)}</span>
                  </div>
                  <p className="text-zinc-300">{comment.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-zinc-400">No comments yet. Be the first to share your thoughts!</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Netlify Identity Modal */}
      <IdentityModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        message="Sign in with your email to upvote this story"
      />
    </main>
  );
}