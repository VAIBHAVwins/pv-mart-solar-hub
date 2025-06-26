import Layout from '@/components/layout/Layout';

export default function VendorQuotationForm() {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-vendor_gray-50 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl">
          <h1 className="text-2xl font-bold mb-6 text-vendor_gray text-center">Vendor Quotation Form</h1>
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSdjkFe1q934yAptp69UlOghFzFwrYrk7IQpOI101axO3M4WXQ/viewform?embedded=true"
            width="100%"
            height="1600"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
            title="Vendor Quotation Form"
            className="w-full"
            allowFullScreen
          >
            Loading…
          </iframe>
        </div>
      </div>
    </Layout>
  );
} 