import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';

export default function BlogDetail() {
  const { id } = useParams();

  // Sample blog content - in a real app, this would come from a CMS or database
  const blogContent = {
    1: {
      title: "Understanding Solar Panel Efficiency: What You Need to Know",
      content: `
        <h2>What is Solar Panel Efficiency?</h2>
        <p>Solar panel efficiency refers to the percentage of sunlight that a solar panel can convert into usable electricity. Modern solar panels typically have efficiency ratings between 15% and 22%, with premium panels reaching even higher efficiencies.</p>
        
        <h2>Factors Affecting Solar Panel Efficiency</h2>
        <p>Several factors influence the efficiency of solar panels:</p>
        <ul>
          <li><strong>Temperature:</strong> High temperatures can reduce panel efficiency</li>
          <li><strong>Shading:</strong> Even partial shading can significantly impact performance</li>
          <li><strong>Angle and Orientation:</strong> Proper positioning maximizes energy capture</li>
          <li><strong>Panel Quality:</strong> Higher-grade materials typically offer better efficiency</li>
        </ul>

        <h2>How to Maximize Your Solar Panel Efficiency</h2>
        <p>To get the most out of your solar installation, consider these best practices:</p>
        <ol>
          <li>Regular cleaning and maintenance</li>
          <li>Proper installation angle (typically 30-45 degrees)</li>
          <li>Avoiding shading from trees or buildings</li>
          <li>Using high-quality inverters and components</li>
        </ol>
      `,
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=400&fit=crop",
      date: "2024-01-15",
      category: "Technology",
      author: "PV MART Team"
    }
  };

  // Convert string id to number and find the blog post, fallback to first post
  const numericId = parseInt(id || '1', 10);
  const blog = blogContent[numericId as keyof typeof blogContent] || blogContent[1];

  return (
    <Layout>
      <div className="min-h-screen bg-white py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link to="/blogs" className="text-cornflower_blue hover:text-cornflower_blue-600 mb-6 inline-block">
            ← Back to Blogs
          </Link>
          
          <article>
            <header className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-cornflower_blue text-white px-3 py-1 rounded-full text-sm font-medium">
                  {blog.category}
                </span>
                <span className="text-slate_gray text-sm">
                  {new Date(blog.date).toLocaleDateString()}
                </span>
                <span className="text-slate_gray text-sm">
                  By {blog.author}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-charcoal mb-6">
                {blog.title}
              </h1>
              <img 
                src={blog.image} 
                alt={blog.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
              />
            </header>

            <div 
              className="prose prose-lg max-w-none text-slate_gray"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </article>

          <footer className="mt-12 pt-8 border-t border-slate_gray-200">
            <div className="flex justify-between items-center">
              <Link to="/blogs" className="text-cornflower_blue hover:text-cornflower_blue-600">
                ← Back to All Blogs
              </Link>
              <Link to="/contact" className="bg-cornflower_blue text-white px-6 py-2 rounded-lg hover:bg-cornflower_blue-600 transition-colors">
                Contact Us
              </Link>
            </div>
          </footer>
        </div>
      </div>
    </Layout>
  );
}
