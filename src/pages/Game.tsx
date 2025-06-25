import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// CURSOR AI: Solar Game Page - Professional, branded layout with placeholder
export default function Game() {
  return (
    <Layout>
      {/* CURSOR AI: Hero Section */}
      <section className="relative text-white py-20 bg-gradient-to-br from-[#589bee] via-[#5279ac] to-[#444e59] flex items-center justify-center min-h-[40vh]">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold mb-4 drop-shadow-lg">Solar Game</h1>
          <p className="text-lg mb-6 opacity-90 max-w-xl mx-auto">Learn how solar energy works and optimize your own virtual solar installation! This interactive game helps you understand the impact of choices like panel placement, angle, and weather on energy output.</p>
          <Link to="/">
            <Button className="bg-[#fecb00] text-[#190a02] hover:bg-[#ffe066] font-bold shadow-md">Back to Home</Button>
          </Link>
        </div>
      </section>

      {/* CURSOR AI: Game Placeholder Section */}
      <section className="py-20 bg-[#f6fafd] flex flex-col items-center">
        <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-2xl flex flex-col items-center">
          <div className="w-full h-64 flex items-center justify-center bg-[#deebfc] rounded-lg mb-6 animate-pulse">
            {/* CURSOR AI: Placeholder for interactive solar game */}
            <span className="text-[#5279ac] text-xl font-semibold">[Interactive Solar Game Coming Soon]</span>
          </div>
          <p className="text-[#7c8a9e] text-center">We are building an engaging, educational solar game for you! Stay tuned for updates and new features.</p>
        </div>
      </section>
    </Layout>
  );
} 