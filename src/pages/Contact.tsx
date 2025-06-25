// ENHANCED BY CURSOR AI: Full Contact page with form, business info, and Google Map
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

// CURSOR AI: Modern, professional Contact page redesign with color palette and UI patterns
export default function Contact() {
  // CURSOR AI: Simple form state (no backend yet)
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true); // CURSOR AI: Placeholder for real submission
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#f6fafd] py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-5xl font-extrabold mb-10 text-center text-[#444e59] drop-shadow-lg">Contact Us</h1>

          {/* CURSOR AI: Contact Form Section with card UI */}
          <section className="mb-16">
            <div className="bg-white p-10 rounded-xl shadow-lg animate-fade-in">
              <h2 className="text-3xl font-bold mb-6 text-[#589bee] text-center">Send Us a Message</h2>
              {submitted ? (
                <div className="text-green-600 font-semibold py-8 text-center">Thank you! Your message has been received.</div>
              ) : (
                <form onSubmit={handleSubmit} className="grid gap-5">
                  <input
                    className="border rounded px-4 py-3 text-lg"
                    name="name"
                    placeholder="Your Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                  <input
                    className="border rounded px-4 py-3 text-lg"
                    name="email"
                    type="email"
                    placeholder="Your Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                  <input
                    className="border rounded px-4 py-3 text-lg"
                    name="phone"
                    placeholder="Your Phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />
                  <textarea
                    className="border rounded px-4 py-3 text-lg"
                    name="message"
                    placeholder="Your Message"
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                  <Button type="submit" className="bg-[#589bee] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#5279ac] shadow-md transition">Send Message</Button>
                </form>
              )}
            </div>
          </section>

          {/* CURSOR AI: Business Info Section with card UI */}
          <section className="mb-16">
            <div className="bg-white p-8 rounded-xl shadow-lg animate-fade-in">
              <h2 className="text-2xl font-bold mb-4 text-[#589bee]">Business Information</h2>
              <div className="mb-2"><span className="font-semibold">Address:</span> xyz building, solpur, kolkata, west bengal  pin - 700112</div>
              <div className="mb-2"><span className="font-semibold">Phone:</span> <a href="tel:8986985927" className="text-[#589bee]">8986985927</a></div>
              <div className="mb-2"><span className="font-semibold">Email:</span> <a href="mailto:info@pvmart.com" className="text-[#589bee]">info@pvmart.com</a></div>
              <div className="mb-2"><span className="font-semibold">Hours:</span> 9am to 9pm daily</div>
            </div>
          </section>

          {/* CURSOR AI: Embedded Google Map Section with styled container */}
          <section className="mb-8">
            <div className="rounded-xl overflow-hidden shadow-lg animate-fade-in">
              <iframe
                title="PVMART Location"
                src="https://www.google.com/maps?q=xyz+building+solpur+kolkata+west+bengal+700112&output=embed"
                width="100%"
                height="350"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
              {/* Direct link: https://maps.app.goo.gl/JgWkfQvWoAtJQsmS9 */}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
} 