
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Tag, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image_url: string;
  category: string;
  tags: string[];
  author: string;
  status: string;
  is_pinned: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!slug) return;

      try {
        // Fetch the blog post
        const { data: blogData, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .single();

        if (error) throw error;

        setBlog(blogData);

        // Fetch related blogs (same category, excluding current blog)
        if (blogData) {
          const { data: relatedData } = await supabase
            .from('blogs')
            .select('*')
            .eq('category', blogData.category)
            .eq('status', 'published')
            .neq('id', blogData.id)
            .limit(3);

          setRelatedBlogs(relatedData || []);
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded mb-4"></div>
              <div className="h-64 bg-gray-300 rounded mb-6"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!blog) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog post not found</h1>
            <Link to="/blogs">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blogs
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-6">
            <Link to="/blogs">
              <Button variant="ghost" className="pl-0">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blogs
              </Button>
            </Link>
          </div>

          {/* Blog Header */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            {blog.featured_image_url && (
              <img
                src={blog.featured_image_url}
                alt={blog.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
            )}

            <div className="mb-4">
              <Badge variant="secondary" className="mb-2">
                {blog.category}
              </Badge>
              {blog.is_pinned && (
                <Badge variant="default" className="mb-2 ml-2">
                  Pinned
                </Badge>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {blog.title}
            </h1>

            <div className="flex items-center text-gray-600 text-sm space-x-6 mb-6">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {blog.author}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(blog.published_at || blog.created_at).toLocaleDateString()}
              </div>
            </div>

            {blog.excerpt && (
              <p className="text-lg text-gray-700 mb-6 font-medium">
                {blog.excerpt}
              </p>
            )}
          </div>

          {/* Blog Content */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex items-center mb-3">
                <Tag className="w-4 h-4 mr-2 text-gray-600" />
                <span className="font-medium text-gray-900">Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Related Blogs */}
          {relatedBlogs.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Related Articles
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {relatedBlogs.map((relatedBlog) => (
                  <Card key={relatedBlog.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      {relatedBlog.featured_image_url && (
                        <img
                          src={relatedBlog.featured_image_url}
                          alt={relatedBlog.title}
                          className="w-full h-32 object-cover rounded mb-3"
                        />
                      )}
                      <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {relatedBlog.title}
                      </h4>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {relatedBlog.excerpt}
                      </p>
                      <Link to={`/blog/${relatedBlog.slug}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          Read More
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BlogDetail;
