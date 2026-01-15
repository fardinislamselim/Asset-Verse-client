import toast from "react-hot-toast";

const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-primary text-primary-content text-center">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Ready to Streamline Your Assets?
        </h2>
        <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
          Join hundreds of forward-thinking companies using AssetVerse to manage
          their resources efficiently.
        </p>

        <form 
          className="flex flex-col md:flex-row gap-6 justify-center max-w-lg mx-auto"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("We've received your request!");
            e.target.reset();
          }}
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="input input-lg text-base-content w-full rounded-field"
            required
          />
          <button type="submit" className="btn btn-secondary btn-lg rounded-field px-8">
            Get Started
          </button>
        </form>
        <p className="mt-8 text-sm opacity-75">
          No credit card required for basic plan.
        </p>
      </div>
    </section>
  );
};

export default Contact;
