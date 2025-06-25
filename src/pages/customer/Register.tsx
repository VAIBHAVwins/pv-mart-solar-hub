// ENHANCED BY CURSOR AI: Embedded Google Form for customer registration
export default function CustomerRegister() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Customer Registration</h1>
      {/* Google Form embed for customer registration. Replace the src with your own form if needed. */}
      <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLSfBg8fmfXbNu-CH6cNfmO_pUuEqxAtEZVpVuHGZqoqls-STjw/viewform?embedded=true"
        width="100%"
        height="900"
        frameBorder="0"
        marginHeight={0}
        marginWidth={0}
        title="Customer Registration Form"
        className="w-full max-w-2xl mx-auto border rounded shadow-lg bg-white"
        allowFullScreen
      >
        Loading…
      </iframe>
    </div>
  );
}
