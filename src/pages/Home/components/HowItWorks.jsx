
const HowItWorks = () => {
  return (
    <section className="py-24 bg-base-100">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-neutral mb-16">How It Works</h2>

        <div className="grid md:grid-cols-3 gap-12 relative">
          
          <div className="hidden md:block absolute top-8 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent -z-10"></div>

          {[
            {
              step: "01",
              title: "Create Account",
              desc: "Register as an HR Manager and set up your company profile.",
            },
            {
              step: "02",
              title: "Add Assets",
              desc: "List your company assets and invite employees to join.",
            },
            {
              step: "03",
              title: "Manage Requests",
              desc: "Approve asset requests and track returnables easily.",
            },
          ].map((item, idx) => (
            <div key={idx} className="bg-base-100 p-6">
              <div className="w-16 h-16 mx-auto bg-primary text-primary-content rounded-full flex items-center justify-center text-2xl font-bold mb-6 shadow-lg border-4 border-base-100">
                {item.step}
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
