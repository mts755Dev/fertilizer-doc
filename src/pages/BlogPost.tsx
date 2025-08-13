import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, User, Tag, ArrowLeft, Share2, Eye } from "lucide-react";
import "./BlogPost.css";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author_name: string;
  published_at: string;
  featured_image_url?: string;
  category: string;
  tags: string[];
  reading_time_minutes: number;
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      // Fetch the specific post
      // @ts-expect-error - blog_posts table is new, types need to be regenerated
      const { data: postData, error: postError } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .eq("blog_type", "fertility")
        .single();

      if (postError) throw postError;

      setPost(postData);

      // Fetch related posts
      // @ts-expect-error - blog_posts table is new, types need to be regenerated
      const { data: relatedData, error: relatedError } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("status", "published")
        .eq("blog_type", "fertility")
        .neq("id", postData.id)
        .or(`category.eq.${postData.category},tags.cs.{${postData.tags.slice(0, 2).join(',')}}`)
        .order("published_at", { ascending: false })
        .limit(3);

      if (!relatedError) {
        setRelatedPosts(relatedData || []);
      }
    } catch (error) {
      console.error("Error fetching blog post:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const sharePost = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  const renderContent = (content: string) => {
    // Convert markdown-style content to proper HTML with enhanced styling
    const processedContent = content
      // Convert **text** to <strong>text</strong>
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Convert *text* to <em>text</em>
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Convert ## Heading to <h2>Heading</h2>
      .replace(/^##\s+(.+)$/gm, '<h2>$1</h2>')
      // Convert ### Heading to <h3>Heading</h3>
      .replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
      // Convert #### Heading to <h4>Heading</h4>
      .replace(/^####\s+(.+)$/gm, '<h4>$1</h4>')
      // Convert paragraphs (text not starting with #, *, -, >)
      .replace(/^(?!<[h|u|o|b|i|s]|<h|<u|<o|<b|<i|<s|#|\*|-|>)(.+)$/gm, '<p>$1</p>')
      // Convert - item to <li>item</li> (basic list support)
      .replace(/^-\s+(.+)$/gm, '<li>$1</li>')
      // Wrap consecutive <li> elements in <ul>
      .replace(/(<li[^>]*>.*?<\/li>)+/gs, '<ul>$&</ul>')
      // Convert > quote to <blockquote>quote</blockquote>
      .replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>')
      // Convert `code` to <code>code</code>
      .replace(/`([^`]+)`/g, '<code>$1</code>');

    return processedContent;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Helmet>
          <title>Loading... | FertilityIQ</title>
        </Helmet>
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Helmet>
          <title>Post Not Found | FertilityIQ</title>
        </Helmet>
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Post Not Found</h1>
            <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/blog">Back to Blog</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{post.title} | FertilityIQ</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        {post.featured_image_url && (
          <meta property="og:image" content={post.featured_image_url} />
        )}
      </Helmet>
      
      <Navbar />
      
      {/* Article Header */}
      <article className="py-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Button variant="outline" asChild className="mb-8 bg-white hover:bg-gray-50 border-2 border-primary text-primary hover:text-primary font-semibold px-6 py-3 shadow-md hover:shadow-lg transition-all duration-200">
            <Link to="/blog">
              <ArrowLeft className="w-5 h-5 mr-3" />
              Back to Blog
            </Link>
          </Button>

          {/* Main Content Container - Reduced Width for Better Readability */}
          <div className="max-w-4xl mx-auto">
            {/* Featured Image */}
            {post.featured_image_url && (
              <div className="mb-8">
                <img
                  src={post.featured_image_url}
                  alt={post.title}
                  className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                />
              </div>
            )}

            {/* Article Meta */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{post.author_name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.published_at)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{post.reading_time_minutes} min read</span>
                </div>
              </div>

              {/* Category and Tags */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge className="bg-primary text-white">
                  {post.category}
                </Badge>
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Share Button */}
              <Button variant="outline" size="sm" onClick={sharePost}>
                <Share2 className="w-4 h-4 mr-2" />
                Share Article
              </Button>
            </div>

            {/* Article Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Article Content with Enhanced Typography */}
            <div className="prose prose-lg max-w-none">
              <div 
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
              />
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <Card key={relatedPost.id} className="group hover:shadow-lg transition-all duration-300">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={relatedPost.featured_image_url || "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop&crop=center&auto=format&q=80"}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-6">
                      <Badge variant="secondary" className="mb-3">
                        {relatedPost.category}
                      </Badge>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300">
                        <Link to={`/blog/${relatedPost.slug}`}>
                          {relatedPost.title}
                        </Link>
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{formatDate(relatedPost.published_at)}</span>
                        <span>•</span>
                        <span>{relatedPost.reading_time_minutes} min read</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
      
      <Footer />
    </div>
  );
} 