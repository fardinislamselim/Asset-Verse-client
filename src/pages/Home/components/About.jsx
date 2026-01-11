import { motion } from "framer-motion";
import {
    FaBoxOpen,
    FaUserShield,
} from "react-icons/fa";
import { RiSecurePaymentLine, RiTeamLine } from "react-icons/ri";

const About = () => {
  return (
    <section id="about" className="py-24 bg-base-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-neutral mb-4">
            Why Choose AssetVerse?
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            We provide a comprehensive solution to handle corporate assets
            efficiently, reducing loss and improving accountability.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: FaBoxOpen,
              title: "Centralized Tracking",
              desc: "Track all company assets in one unified dashboard.",
            },
            {
              icon: FaUserShield,
              title: "Employee Accountability",
              desc: "Ensure every asset is assigned and accounted for.",
            },
            {
              icon: RiSecurePaymentLine,
              title: "Reduced Loss",
              desc: "Minimize asset loss with real-time tracking history.",
            },
            {
              icon: RiTeamLine,
              title: "Simplified HR Ops",
              desc: "Streamline request approvals and asset distribution.",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="p-8 rounded-box bg-base-100 border border-base-200 hover:shadow-xl hover:border-primary/30 transition-all text-center group"
            >
              <div className="w-16 h-16 mx-auto bg-primary/5 rounded-2xl flex items-center justify-center text-primary text-3xl mb-6 group-hover:scale-110 transition-transform">
                <item.icon />
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
