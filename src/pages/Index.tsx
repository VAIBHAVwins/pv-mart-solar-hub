
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#589bee] to-[#5279ac] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Your Solar Energy Journey Starts Here
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Connect with verified solar vendors and get the best quotations for your solar installation needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/customer/register">
              <Button size="lg" className="bg-white text-[#589bee] hover:bg-gray-100">
                Get Started as Customer
              </Button>
            </Link>
            <Link to="/vendor/register">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#589bee]">
                Join as Vendor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-[#deebfc]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#444e59]">How PVMart Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-[#589bee] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">1</div>
              <h3 className="text-xl font-semibold mb-2 text-[#444e59]">Submit Requirements</h3>
              <p className="text-[#7c8a9e]">Tell us about your solar needs - capacity, location, and preferences</p>
            </div>
            <div className="text-center">
              <div className="bg-[#589bee] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">2</div>
              <h3 className="text-xl font-semibold mb-2 text-[#444e59]">Get Quotations</h3>
              <p className="text-[#7c8a9e]">Receive detailed quotes from verified vendors with price breakdowns</p>
            </div>
            <div className="text-center">
              <div className="bg-[#589bee] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">3</div>
              <h3 className="text-xl font-semibold mb-2 text-[#444e59]">Connect & Install</h3>
              <p className="text-[#7c8a9e]">Choose the best vendor and get connected for professional installation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#444e59]">Why Choose PVMart?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#589bee]">
              <h3 className="text-lg font-semibold mb-2 text-[#444e59]">Verified Vendors</h3>
              <p className="text-[#7c8a9e]">All vendors are thoroughly verified and certified</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#5279ac]">
              <h3 className="text-lg font-semibold mb-2 text-[#444e59]">Best Prices</h3>
              <p className="text-[#7c8a9e]">Compare quotes and get the best deal for your needs</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#576779]">
              <h3 className="text-lg font-semibold mb-2 text-[#444e59]">Expert Support</h3>
              <p className="text-[#7c8a9e]">Get guidance throughout your solar journey</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#434647]">
              <h3 className="text-lg font-semibold mb-2 text-[#444e59]">Quality Assured</h3>
              <p className="text-[#7c8a9e]">High-quality installations with warranty coverage</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#444e59] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Go Solar?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of satisfied customers who chose PVMart</p>
          <Link to="/customer/requirements">
            <Button size="lg" className="bg-[#589bee] hover:bg-[#5279ac]">
              Get Your Solar Quote Now
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
