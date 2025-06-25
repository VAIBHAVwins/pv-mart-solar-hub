import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';

// ENHANCED BY CURSOR AI: Modern, professional homepage redesign with color palette and game link
export default function Home() {
  return (
    <Layout>
      {/* CURSOR AI: Hero Section */}
      <section className="relative text-white py-24 bg-gradient-to-br from-[#589bee] via-[#5279ac] to-[#444e59] flex items-center justify-center min-h-[60vh]">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-extrabold mb-6 drop-shadow-lg">Empowering India's Solar Revolution</h1>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">PVMart connects you with trusted solar vendors for affordable, high-quality solar installations. Start your journey to clean energy today.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link to="/customer/register">
              <Button size="lg" className="bg-[#fecb00] text-[#190a02] hover:bg-[#ffe066] font-bold shadow-md">Get Started as Customer</Button>
            </Link>
            <Link to="/vendor/register">
              <Button size="lg" variant="outline" className="border-[#fff] text-white hover:bg-[#fff] hover:text-[#5279ac] font-bold shadow-md">Join as Vendor</Button>
            </Link>
            <Link to="/game">
              <Button size="lg" className="bg-[#0895c6] text-white hover:bg-[#4fcdf8] font-bold shadow-md">Play Solar Game</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CURSOR AI: How It Works Section */}
      <section className="py-20 bg-[#f6fafd]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#444e59]">How PVMart Works</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center transition-transform hover:-translate-y-2 hover:shadow-2xl">
              <div className="bg-[#589bee] text-white rounded-full w-16 h-16 flex items-center justify-center mb-4 text-2xl font-bold">1</div>
              <h3 className="text-xl font-semibold mb-2 text-[#444e59]">Submit Requirements</h3>
              <p className="text-[#7c8a9e]">Tell us about your solar needs—capacity, location, and preferences.</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center transition-transform hover:-translate-y-2 hover:shadow-2xl">
              <div className="bg-[#5279ac] text-white rounded-full w-16 h-16 flex items-center justify-center mb-4 text-2xl font-bold">2</div>
              <h3 className="text-xl font-semibold mb-2 text-[#444e59]">Get Quotations</h3>
              <p className="text-[#7c8a9e]">Receive detailed quotes from verified vendors with price breakdowns.</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center transition-transform hover:-translate-y-2 hover:shadow-2xl">
              <div className="bg-[#fecb00] text-[#190a02] rounded-full w-16 h-16 flex items-center justify-center mb-4 text-2xl font-bold">3</div>
              <h3 className="text-xl font-semibold mb-2 text-[#444e59]">Connect & Install</h3>
              <p className="text-[#7c8a9e]">Choose the best vendor and get connected for professional installation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CURSOR AI: Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#444e59]">Why Choose PVMart?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-[#f6fafd] p-6 rounded-xl shadow border-l-4 border-[#589bee] flex flex-col items-center">
              <h3 className="text-lg font-semibold mb-2 text-[#444e59]">Verified Vendors</h3>
              <p className="text-[#7c8a9e] text-center">All vendors are thoroughly verified and certified.</p>
            </div>
            <div className="bg-[#f6fafd] p-6 rounded-xl shadow border-l-4 border-[#5279ac] flex flex-col items-center">
              <h3 className="text-lg font-semibold mb-2 text-[#444e59]">Best Prices</h3>
              <p className="text-[#7c8a9e] text-center">Compare quotes and get the best deal for your needs.</p>
            </div>
            <div className="bg-[#f6fafd] p-6 rounded-xl shadow border-l-4 border-[#576779] flex flex-col items-center">
              <h3 className="text-lg font-semibold mb-2 text-[#444e59]">Expert Support</h3>
              <p className="text-[#7c8a9e] text-center">Get guidance throughout your solar journey.</p>
            </div>
            <div className="bg-[#f6fafd] p-6 rounded-xl shadow border-l-4 border-[#434647] flex flex-col items-center">
              <h3 className="text-lg font-semibold mb-2 text-[#444e59]">Quality Assured</h3>
              <p className="text-[#7c8a9e] text-center">High-quality installations with warranty coverage.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CURSOR AI: About Section - Company overview and mission */}
      <section className="py-20 bg-[#f6fafd]">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-4 text-[#444e59]">About PVMart</h2>
            <p className="text-[#7c8a9e] mb-4">PVMart is dedicated to making solar energy accessible and affordable for everyone. Our mission is to connect homeowners and businesses with trusted solar vendors, ensuring a seamless transition to clean energy. With years of experience in the solar industry, we guarantee quality, transparency, and expert support at every step.</p>
            <p className="text-[#7c8a9e]">Join us in our journey to a sustainable future powered by the sun.</p>
          </div>
          <div className="flex-1 flex justify-center">
            {/* CURSOR AI: Placeholder for company/solar image */}
            <img src="/placeholder.svg" alt="About PVMart" className="w-80 h-80 object-contain rounded-xl shadow-lg" />
          </div>
        </div>
      </section>

      {/* CURSOR AI: Services Overview Section - Main solar services grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#444e59]">Our Solar Services</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-[#f6fafd] p-8 rounded-xl shadow-lg text-center transition-transform hover:-translate-y-2 hover:shadow-2xl">
              <img src="/placeholder.svg" alt="Residential Solar" className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-[#444e59]">Residential Solar</h3>
              <p className="text-[#7c8a9e]">Custom solar solutions for homes, including rooftop and ground-mount systems.</p>
            </div>
            <div className="bg-[#f6fafd] p-8 rounded-xl shadow-lg text-center transition-transform hover:-translate-y-2 hover:shadow-2xl">
              <img src="/placeholder.svg" alt="Commercial Solar" className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-[#444e59]">Commercial Solar</h3>
              <p className="text-[#7c8a9e]">Scalable solar installations for businesses, offices, and industrial facilities.</p>
            </div>
            <div className="bg-[#f6fafd] p-8 rounded-xl shadow-lg text-center transition-transform hover:-translate-y-2 hover:shadow-2xl">
              <img src="/placeholder.svg" alt="Solar Maintenance" className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-[#444e59]">Solar Maintenance</h3>
              <p className="text-[#7c8a9e]">Ongoing maintenance, cleaning, and performance monitoring for your solar systems.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CURSOR AI: Contact Information Section - Phone, email, business hours */}
      <section className="py-16 bg-[#deebfc]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4 text-[#444e59]">Contact Us</h2>
          <div className="flex flex-col md:flex-row justify-center gap-8 text-[#444e59]">
            <div>
              <div className="font-semibold">Phone</div>
              <div>+1 (555) 123-4567</div>
            </div>
            <div>
              <div className="font-semibold">Email</div>
              <div>info@pvmart.com</div>
            </div>
            <div>
              <div className="font-semibold">Business Hours</div>
              <div>Mon-Fri: 9am - 6pm</div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
