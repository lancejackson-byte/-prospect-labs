const FAQS = [
  {
    q: "What is Prospect Labs?",
    a: "Prospect Labs is an all-in-one B2B lead generation, AI email outreach, and CRM platform built for small businesses and sales teams. We replace your fragmented stack of data brokers, email tools, and spreadsheets with one integrated solution.",
  },
  {
    q: "How does the AI email generation work?",
    a: "Our AI analyzes your business profile, target customer, and value proposition to generate personalized outreach emails. You can choose from preset templates (cold outreach, follow-up, introduction) and adjust tone and length.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes! We offer a 14-day free trial of our Pro Growth plan so you can test all features risk-free. No credit card required to start.",
  },
  {
    q: "What industries do you support?",
    a: "We cover major B2B service industries including commercial cleaning, real estate, roofing, pressure washing, junk removal, freight/logistics, insurance, construction, recruiting, and marketing agencies.",
  },
  {
    q: "How do you source your leads?",
    a: "Leads are sourced from public business databases, verified through email validation services, and enriched with company information. We prioritize data accuracy and compliance.",
  },
  {
    q: "Can I use my own email account?",
    a: "Yes! You can connect Gmail via OAuth or any SMTP provider to send emails directly from your own address.",
  },
];

export function FAQAccordion() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
          <p className="mt-4 text-muted-foreground">
            Everything you need to know about Prospect Labs.
          </p>
        </div>
        <div className="mt-12 space-y-4">
          {FAQS.map((faq) => (
            <details key={faq.q} className="group rounded-lg border">
              <summary className="flex cursor-pointer items-center justify-between p-4 font-medium">
                {faq.q}
                <span className="ml-2 text-muted-foreground transition-transform group-open:rotate-180">▼</span>
              </summary>
              <div className="px-4 pb-4 text-sm text-muted-foreground">{faq.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
