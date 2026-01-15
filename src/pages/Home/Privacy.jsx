import Container from "../../components/Container/Container";

const Privacy = () => {
  return (
    <div className="bg-base-100 min-h-screen pt-24 lg:pt-32 pb-20">
      <Container className="max-w-4xl">
        <h1 className="text-4xl font-extrabold mb-8">Privacy Policy</h1>
        <div className="prose prose-lg max-w-none text-base-content/70">
          <p className="mb-6">
            Last updated: January 12, 2026. At AssetVerse, we take your privacy seriously. This policy explains how we collect, use, and protect your data.
          </p>

          <h2 className="text-2xl font-bold text-base-content mt-8 mb-4">1. Data Collection</h2>
          <p className="mb-6">
            We collect information you provide directly to us, such as when you create an account, request an asset, or contact support. This includes your name, email, company name, and profile photo.
          </p>

          <h2 className="text-2xl font-bold text-base-content mt-8 mb-4">2. Use of Information</h2>
          <p className="mb-6">
            Your data is used to provide the asset management service, process transactions, and communicate with you about your account. We do not sell your data to third parties.
          </p>

          <h2 className="text-2xl font-bold text-base-content mt-8 mb-4">3. Data Security</h2>
          <p className="mb-6">
            We use industry-standard encryption and security measures to protect your information from unauthorized access or disclosure.
          </p>

          <h2 className="text-2xl font-bold text-base-content mt-8 mb-4">4. Your Rights</h2>
          <p className="mb-6">
            You have the right to access, correct, or delete your personal data. You can manage your profile settings within the application or contact us for assistance.
          </p>

          <div className="mt-12 p-8 bg-primary/5 rounded-3xl border border-primary/10">
              <h3 className="font-bold mb-2">Need more clarity?</h3>
              <p className="text-sm">Reach out to our legal team at <span className="text-primary font-bold">legal@assetverse.io</span></p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Privacy;
