import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// CURSOR AI: Modern, professional Services page redesign with color palette and UI patterns
export default function Services() {
  return (
    <Layout>
      <div className="min-h-screen bg-[#f6fafd] py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-5xl font-extrabold mb-10 text-center text-[#444e59] drop-shadow-lg">Our Solar Services</h1>

          {/* CURSOR AI: Service Listings Section with card UI */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-8 text-[#589bee] text-center">Service Offerings</h2>
            <div className="grid md:grid-cols-3 gap-10">
              <div className="bg-white p-8 rounded-xl shadow-lg text-center transition-transform hover:-translate-y-2 hover:shadow-2xl animate-fade-in">
                <h3 className="text-xl font-bold mb-2 text-[#589bee]">Residential Solar Installation</h3>
                <p className="text-[#7c8a9e] mb-2">Custom rooftop and ground-mount solar systems for homes.</p>
                <div className="text-lg text-[#444e59]">Starting at <span className="font-semibold">$4,000</span></div>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg text-center transition-transform hover:-translate-y-2 hover:shadow-2xl animate-fade-in delay-100">
                <h3 className="text-xl font-bold mb-2 text-[#589bee]">Commercial Solar Solutions</h3>
                <p className="text-[#7c8a9e] mb-2">Large-scale solar for businesses, offices, and factories.</p>
                <div className="text-lg text-[#444e59]">Starting at <span className="font-semibold">$15,000</span></div>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg text-center transition-transform hover:-translate-y-2 hover:shadow-2xl animate-fade-in delay-200">
                <h3 className="text-xl font-bold mb-2 text-[#589bee]">Solar Maintenance & Monitoring</h3>
                <p className="text-[#7c8a9e] mb-2">Cleaning, repairs, and performance monitoring for all systems.</p>
                <div className="text-lg text-[#444e59]">Plans from <span className="font-semibold">$199/year</span></div>
              </div>
            </div>
          </section>

          {/* CURSOR AI: Service Areas Section with card UI */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-8 text-[#589bee] text-center">Service Areas</h2>
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto animate-fade-in">
              <p className="text-[#7c8a9e] mb-4 text-center">We proudly serve the following regions:</p>
              <ul className="list-disc list-inside text-[#444e59] text-lg grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                <li>Delhi NCR</li>
                <li>Mumbai & Maharashtra</li>
                <li>Bangalore & Karnataka</li>
                <li>Chennai & Tamil Nadu</li>
                <li>Punjab, Rajasthan, Gujarat</li>
                <li>And more (pan-India coverage)</li>
              </ul>
            </div>
          </section>

          {/* CURSOR AI: Call to Action Section with prominent button */}
          <section className="text-center mt-16">
            <h2 className="text-2xl font-bold mb-4 text-[#444e59]">Ready to get started?</h2>
            <Link to="/customer/requirements">
              <Button size="lg" className="bg-[#589bee] text-white px-10 py-4 rounded-lg font-semibold hover:bg-[#5279ac] shadow-md transition">Request a Quote</Button>
            </Link>
          </section>
        </div>
      </div>
    </Layout>
  );
} 