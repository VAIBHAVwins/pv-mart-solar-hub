
// ENHANCED BY CURSOR AI: Public blog listing page with static content
import Layout from '@/components/layout/Layout';
import { Link } from 'react-router-dom';

// Static blog posts data
const staticPosts = [
  {
    id: '1',
    title: 'Understanding Solar Panel Efficiency: What You Need to Know',
    content: 'Solar panel efficiency refers to the percentage of sunlight that a solar panel can convert into usable electricity. Modern solar panels typically have efficiency ratings between 15% and 22%, with premium panels reaching even higher efficiencies.',
    createdAt: '2024-01-15',
    excerpt: 'Learn about solar panel efficiency and how to maximize your solar investment.'
  },
  {
    id: '2', 
    title: 'Benefits of On-Grid vs Off-Grid Solar Systems',
    content: 'When choosing a solar system, understanding the difference between on-grid and off-grid systems is crucial for making the right decision for your home or business.',
    createdAt: '2024-01-10',
    excerpt: 'Compare on-grid and off-grid solar systems to find the best fit for your needs.'
  },
  {
    id: '3',
    title: 'Solar Installation Process: A Step-by-Step Guide',
    content: 'Installing solar panels involves several important steps from initial assessment to final commissioning. Understanding this process helps you prepare for your solar journey.',
    createdAt: '2024-01-05',
    excerpt: 'A comprehensive guide to the solar installation process from start to finish.'
  }
];

// CURSOR AI: Modern, professional Blog Listing redesign with common color palette and UI patterns
export default function Blog() {
  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f6fafd] py-16 px-4">
        <div className="w-full max-w-2xl">
          <h1 className="text-4xl font-extrabold mb-8 text-center text-[#444e59] drop-shadow-lg">Solar Blog</h1>
          <div className="space-y-6">
            {staticPosts.map(post => (
              <div key={post.id} className="bg-white rounded-xl shadow-lg p-6 animate-fade-in">
                <Link to={`/blog/${post.id}`} className="font-extrabold text-[#589bee] hover:underline text-2xl mb-2 block transition-colors">{post.title}</Link>
                <div className="text-xs text-gray-500 mb-2">{post.createdAt}</div>
                <div className="text-[#444e59] line-clamp-3 mb-2">{post.excerpt}</div>
                <Link to={`/blog/${post.id}`} className="inline-block mt-2 text-[#5279ac] hover:text-[#589bee] font-semibold underline transition">Read More</Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
