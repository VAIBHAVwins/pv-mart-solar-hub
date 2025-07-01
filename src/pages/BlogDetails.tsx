
// ENHANCED BY CURSOR AI: Public blog detail page with static content
import Layout from '@/components/layout/Layout';
import { useParams, Link } from 'react-router-dom';

// Static blog content
const blogContent = {
  '1': {
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
    createdAt: '2024-01-15'
  },
  '2': {
    title: "Benefits of On-Grid vs Off-Grid Solar Systems",
    content: `
      <h2>On-Grid Solar Systems</h2>
      <p>On-grid systems are connected to the utility grid and offer several advantages:</p>
      <ul>
        <li>Lower initial investment</li>
        <li>Net metering benefits</li>
        <li>Grid backup power</li>
        <li>Easier maintenance</li>
      </ul>

      <h2>Off-Grid Solar Systems</h2>
      <p>Off-grid systems provide complete energy independence:</p>
      <ul>
        <li>Energy independence</li>
        <li>No monthly electricity bills</li>
        <li>Works in remote locations</li>
        <li>Environmentally friendly</li>
      </ul>
    `,
    createdAt: '2024-01-10'
  },
  '3': {
    title: "Solar Installation Process: A Step-by-Step Guide",
    content: `
      <h2>Step 1: Site Assessment</h2>
      <p>Our team conducts a thorough evaluation of your property to determine the best solar solution.</p>

      <h2>Step 2: System Design</h2>
      <p>We create a custom solar system design based on your energy needs and roof specifications.</p>

      <h2>Step 3: Permits and Approvals</h2>
      <p>We handle all necessary permits and utility approvals for your installation.</p>

      <h2>Step 4: Installation</h2>
      <p>Professional installation typically takes 1-3 days depending on system size.</p>

      <h2>Step 5: Commissioning</h2>
      <p>Final testing and activation of your solar system.</p>
    `,
    createdAt: '2024-01-05'
  }
};

// CURSOR AI: Modern, professional Blog Details redesign with common color palette and UI patterns
export default function BlogDetails() {
  const { id } = useParams();
  const post = blogContent[id as keyof typeof blogContent];

  if (!post) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f6fafd] py-16 px-4">
          <div className="w-full max-w-2xl text-center">
            <h1 className="text-3xl font-bold text-[#444e59] mb-4">Post Not Found</h1>
            <Link to="/blog" className="text-[#589bee] hover:underline">← Back to Blog</Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f6fafd] py-16 px-4">
        <div className="w-full max-w-2xl">
          <Link to="/blog" className="text-[#589bee] hover:underline mb-4 inline-block">← Back to Blog</Link>
          <div className="bg-white rounded-xl shadow-lg p-10 animate-fade-in">
            <h1 className="text-3xl font-extrabold mb-4 text-[#444e59] drop-shadow">{post.title}</h1>
            <div className="text-xs text-gray-500 mb-6">{post.createdAt}</div>
            <div className="prose prose-lg max-w-none text-[#444e59]" dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
