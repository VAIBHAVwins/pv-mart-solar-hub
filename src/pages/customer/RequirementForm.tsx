import Layout from '@/components/layout/Layout';

export default function CustomerRequirementForm() {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-cornflower_blue-50 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl">
          <h1 className="text-2xl font-bold mb-6 text-cornflower_blue text-center">Customer Requirement Form</h1>
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSdbuVmhwpsO4LYaUv4v9TDKPL_FxPBNAOquU6SLUhnf72NuWQ/viewform?embedded=true"
            width="100%"
            height="1400"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
            title="Customer Requirement Form"
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
