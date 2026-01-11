import { motion } from "framer-motion";
import { FaBuilding, FaGlobe, FaSmile, FaTools } from "react-icons/fa";

const Stats = () => {
  const stats = [
    { icon: FaBuilding, value: "500+", label: "Companies Trusted", color: "text-primary" },
    { icon: FaTools, value: "50k+", label: "Assets Managed", color: "text-secondary" },
    { icon: FaGlobe, value: "12+", label: "Countries Served", color: "text-accent" },
    { icon: FaSmile, value: "99%", label: "Customer Satisfaction", color: "text-success" },
  ];

  return (
    <section className="py-20 bg-base-200">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-base-100 p-8 rounded-box shadow-xl border border-base-300 text-center group hover:scale-105 transition-transform"
            >
              <div className={`text-4xl mb-4 flex justify-center ${stat.color}`}>
                <stat.icon />
              </div>
              <h3 className="text-4xl font-black mb-2">{stat.value}</h3>
              <p className="text-sm font-bold opacity-50 uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
