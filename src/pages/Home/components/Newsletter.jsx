import { motion } from "framer-motion";
import { FaPaperPlane } from "react-icons/fa";

const Newsletter = () => {
  return (
    <section className="py-24 bg-base-100">
      <div className="container mx-auto px-6">
        <div className="relative p-8 lg:p-16 rounded-box overflow-hidden bg-primary shadow-2xl">
          {/* Decorative background circles */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-8 backdrop-blur-md"
            >
              <FaPaperPlane />
            </motion.div>
            
            <h2 className="text-3xl lg:text-5xl font-black text-white mb-6">
              Stay ahead with AssetVerse.
            </h2>
            <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Join 10,000+ HR managers receiving our monthly newsletter on 
              operational excellence, asset security, and team productivity.
            </p>

            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your work email"
                className="input input-lg flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 rounded-field"
                required
              />
              <button className="btn btn-lg bg-white text-primary hover:bg-white/90 border-none rounded-field px-8 shadow-xl">
                Subscribe Now
              </button>
            </form>
            
            <p className="mt-6 text-sm text-white/40">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
