
const FAQ = () => {
  return (
    <section className="py-24 bg-base-200">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-neutral mb-4">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="join join-vertical w-full bg-base-100 shadow-xl rounded-2xl">
          {[
            {
              q: "Is there a free trial?",
              a: "Yes! Our Basic plan works great for small teams up to 5 employees.",
            },
            {
              q: "Can I upgrade my package later?",
              a: "Absolutely. You can upgrade your subscription at any time from the HR dashboard.",
            },
            {
              q: "Are my data assets secure?",
              a: "We use enterprise-grade encryption and secure cloud storage for all your data.",
            },
            {
              q: "Can employees request assets?",
              a: "Yes, employees have their own portal to request and manage their assigned assets.",
            },
            {
              q: "Do you offer custom enterprise plans?",
              a: "Yes, please contact our support sales team for custom solutions.",
            },
          ].map((faq, i) => (
            <div
              key={i}
              className="collapse collapse-plus join-item border-base-300 border"
            >
              <input
                type="radio"
                name="my-accordion-4"
                defaultChecked={i === 0}
              />
              <div className="collapse-title text-xl font-medium">{faq.q}</div>
              <div className="collapse-content">
                <p className="text-gray-500">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
