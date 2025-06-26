// ENHANCED BY CURSOR AI: Full Contact page with form, business info, and Google Map
import Layout from '@/components/layout/Layout';

// CURSOR AI: Modern, professional Contact page redesign with color palette and UI patterns
export default function Contact() {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-cornflower_blue-50 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl">
          <h1 className="text-2xl font-bold mb-6 text-cornflower_blue text-center">Contact Us</h1>
          <div className="space-y-4 text-center">
            <div>
              <span className="font-semibold">Phone:</span> 8986985927
            </div>
            <div>
              <span className="font-semibold">Email:</span> info@pvmart.com
            </div>
            <div>
              <span className="font-semibold">Address:</span> xyz building, solpur, kolkata, west bengal - 700112
            </div>
            <div>
              <iframe
                src="https://www.google.com/maps?q=kolkata,west+bengal&output=embed"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                title="Google Map"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 