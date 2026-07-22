export default function LegalPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-3xl font-bold">Legal & Policies</h1>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Privacy Policy</h2>
        <p className="mt-2 text-muted-foreground">
          Prospect Labs respects your privacy. We collect only the information necessary to provide our services.
          We do not sell your personal data. All data is stored securely using industry-standard encryption.
          You may request deletion of your data at any time by contacting support.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Terms of Service</h2>
        <p className="mt-2 text-muted-foreground">
          By using Prospect Labs, you agree to use our platform in compliance with all applicable laws,
          including CAN-SPAM regulations. You are responsible for the content of your email campaigns.
          We reserve the right to suspend accounts that violate our acceptable use policy.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Acceptable Use</h2>
        <p className="mt-2 text-muted-foreground">
          Prospect Labs must not be used for spam, phishing, or any deceptive activities.
          All outreach must be to legitimate business contacts with truthful content and clear opt-out mechanisms.
          Violations will result in immediate account suspension.
        </p>
      </section>
    </div>
  );
}
