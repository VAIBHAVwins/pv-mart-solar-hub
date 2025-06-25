
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';

export default function Blogs() {
  const blogPosts = [
    {
      id: 1,
      title: "Understanding Solar Panel Efficiency: What You Need to Know",
      excerpt: "Learn about solar panel efficiency ratings and how they impact your energy production and savings.",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=250&fit=crop",
      date: "2024-01-15",
      category: "Technology"
    },
    {
      id: 2,
      title: "Government Subsidies for Solar Installation in India 2024",
      excerpt: "Complete guide to available government subsidies and incentives for solar installations.",
      image: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=400&h=250&fit=crop",
      date: "2024-01-10",
      category: "Policy"
    },
    {
      id: 3,
      title: "Maintenance Tips for Your Solar Power System",
      excerpt: "Essential maintenance practices to keep your solar panels running at peak efficiency.",
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=250&fit=crop",
      date: "2024-01-05",
      category: "Maintenance"
    },
    {
      id: 4,
      title: "ROI Analysis: How Long Does It Take to Recover Solar Investment?",
      excerpt: "Detailed analysis of return on investment for different types of solar installations.",
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=250&fit=crop",
      date: "2023-12-28",
      category: "Finance"
    },
    {
      id: 5,
      title: "Choosing the Right Solar Installer: A Complete Guide",
      excerpt: "Key factors to consider when selecting a solar installation company for your project.",
      image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=250&fit=crop",
      date: "2023-12-20",
      category: "Guide"
    },
    {
      id: 6,
      title: "Net Metering Explained: How to Sell Solar Power Back to Grid",
      excerpt: "Understanding net metering policies and how to maximize your solar investment benefits.",
      image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400&h=250&fit=crop",
      date: "2023-12-15",
      category: "Policy"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-cornflower_blue-50 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-10 text-center text-charcoal">
            Solar Energy Blog
          </h1>
          <p className="text-center text-slate_gray mb-12 text-lg max-w-2xl mx-auto">
            Stay updated with the latest trends, tips, and insights in solar energy technology, 
            policies, and best practices.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:-translate-y-2 hover:shadow-2xl">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-cornflower_blue text-white px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                    <span className="text-slate_gray text-sm">
                      {new Date(post.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold mb-3 text-charcoal line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-slate_gray mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <Link 
                    to={`/blog/${post.id}`}
                    className="inline-flex items-center text-cornflower_blue hover:text-cornflower_blue-600 font-medium transition-colors"
                  >
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-slate_gray mb-4">
              Looking for specific information about solar energy?
            </p>
            <Link to="/contact">
              <button className="bg-cornflower_blue text-white px-6 py-3 rounded-lg hover:bg-cornflower_blue-600 transition-colors font-medium">
                Contact Our Experts
              </button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
