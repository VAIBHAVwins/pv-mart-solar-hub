import Layout from '@/components/layout/Layout';

// CURSOR AI: Modern, professional About page redesign with color palette and UI patterns
export default function About() {
  return (
    <Layout>
      <div className="min-h-screen bg-[#f6fafd] py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* CURSOR AI: Company Story Section */}
          <section className="mb-20">
            <h1 className="text-5xl font-extrabold mb-6 text-center text-[#444e59] drop-shadow-lg">About Us</h1>
            <h2 className="text-2xl font-semibold mb-4 text-[#589bee] text-center">Our Story</h2>
            <p className="text-[#444e59] mb-4 leading-relaxed text-lg text-center max-w-3xl mx-auto">
              At PVMART, we are redefining the way solar adoption happens in India. What started as a shared vision among a team of passionate engineers has evolved into a mission-driven platform that bridges the gap between consumers and trusted solar vendors using intelligent, easy-to-use technology.
            </p>
            <p className="text-[#444e59] mb-4 leading-relaxed text-lg text-center max-w-3xl mx-auto">
              Our journey began with one clear purpose: to simplify and accelerate solar installation through accurate planning, smart recommendations, and verified vendor access. We realized that despite growing interest in renewable energy, many individuals and businesses still struggle to evaluate their solar potential, assess return on investment, or find reliable installers—especially in tier-2 and tier-3 cities.
            </p>
            <p className="text-[#444e59] mb-4 leading-relaxed text-lg text-center max-w-3xl mx-auto">
              PVMART was built to solve these challenges. By combining artificial intelligence, responsive web technologies, and a user-first mindset, we provide a platform where anyone—from homeowners to industrial operators—can explore, compare, and start their solar journey with confidence.
            </p>
            <p className="text-[#444e59] mb-4 leading-relaxed text-lg text-center max-w-3xl mx-auto">
              From dynamic ROI calculators to load assessment tools, from 3D solar layout previews to on-grid/off-grid system recommendations, every feature of PVMART has been designed to demystify solar and make it accessible to all. We aim not just to be a digital marketplace, but a solar partner for life.
            </p>
          </section>

          {/* CURSOR AI: Team Section with card UI and subtle animation */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-10 text-[#589bee] text-center">Our Team</h2>
            <div className="grid md:grid-cols-3 gap-10">
              <div className="bg-white p-8 rounded-xl shadow-lg text-center transition-transform hover:-translate-y-2 hover:shadow-2xl animate-fade-in">
                <h3 className="text-xl font-bold mb-2 text-[#444e59]">Ankur Vaibhav</h3>
                <div className="text-[#589bee] font-semibold mb-1">Founder & Lead Engineer</div>
                <p className="text-[#7c8a9e] text-sm">Ankur leads the core technical development at PVMART. With a background in electrical engineering and energy systems, he oversees the AI-driven site assessment engine, backend architecture, and solar simulation models.</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg text-center transition-transform hover:-translate-y-2 hover:shadow-2xl animate-fade-in delay-100">
                <h3 className="text-xl font-bold mb-2 text-[#444e59]">Shrayasee Gain</h3>
                <div className="text-[#589bee] font-semibold mb-1">Co-Founder & Strategy Lead</div>
                <p className="text-[#7c8a9e] text-sm">Shrayasee brings operational clarity and strategic planning to PVMART. Her experience in product coordination and customer journey design ensures that the platform remains focused on usability and long-term impact.</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg text-center transition-transform hover:-translate-y-2 hover:shadow-2xl animate-fade-in delay-200">
                <h3 className="text-xl font-bold mb-2 text-[#444e59]">Arpan Das</h3>
                <div className="text-[#589bee] font-semibold mb-1">Co-Founder & UI/UX Developer</div>
                <p className="text-[#7c8a9e] text-sm">Arpan is the creative force behind PVMART's interface. With a keen eye for detail and accessibility, he designs seamless user experiences that work effortlessly across mobile, tablet, and desktop devices.</p>
              </div>
            </div>
          </section>

          {/* CURSOR AI: Certifications Section with card UI */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-8 text-[#589bee] text-center">Certifications & Licenses</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4 animate-fade-in">
                <span className="text-2xl text-[#589bee] font-bold">MNRE</span>
                <div>
                  <div className="font-semibold text-[#444e59]">Approved Channel Partner</div>
                  <div className="text-[#7c8a9e] text-sm">(Placeholder)</div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4 animate-fade-in delay-100">
                <span className="text-2xl text-[#589bee] font-bold">ISO</span>
                <div>
                  <div className="font-semibold text-[#444e59]">9001:2015 Certified</div>
                  <div className="text-[#7c8a9e] text-sm">(Placeholder)</div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4 animate-fade-in delay-200">
                <span className="text-2xl text-[#589bee] font-bold">SNA</span>
                <div>
                  <div className="font-semibold text-[#444e59]">State Nodal Agency Registration</div>
                  <div className="text-[#7c8a9e] text-sm">(Placeholder)</div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4 animate-fade-in delay-300">
                <span className="text-2xl text-[#589bee] font-bold">Other</span>
                <div>
                  <div className="font-semibold text-[#444e59]">Industry Licenses & Qualifications</div>
                  <div className="text-[#7c8a9e] text-sm">(Placeholder)</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
} 