import { motion } from "framer-motion";
import { FaFingerprint, FaKey, FaLock, FaUserShield } from "react-icons/fa";

const SecuritySection = () => {
  const securityFeatures = [
    {
      icon: FaLock,
      title: "End-to-End Encryption",
      desc: "All your asset data is encrypted both in transit and at rest using AES-256.",
    },
    {
      icon: FaFingerprint,
      title: "Multi-Factor Authentication",
      desc: "Protect your organization with secure biometric and app-based MFA.",
    },
    {
      icon: FaUserShield,
      title: "Role-Based Permissions",
      desc: "Grant precise access to HR, Managers, and Employees with custom roles.",
    },
    {
      icon: FaKey,
      title: "Audit Logs",
      desc: "Track every single change with immutable logs for full transparency.",
    },
  ];

  return (
    <section className="py-24 bg-neutral text-neutral-content">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-4xl lg:text-5xl font-black mb-6 leading-tight">
              Enterprise-Grade <br />
              <span className="text-primary">Security First.</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              We understand that your internal asset information is sensitive. 
              That's why we've built AssetVerse with a security-first architecture 
              trusted by world-leading organizations.
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-box border border-white/10">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                  <FaShieldAlt className="text-2xl" />
                </div>
                <div>
                  <h4 className="font-bold">GDPR & SOC2 Compliant</h4>
                  <p className="text-xs text-gray-500">Your data is stored securely in regional data centers.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 grid sm:grid-cols-2 gap-6">
            {securityFeatures.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-white/5 rounded-box border border-white/10 hover:border-primary/50 transition-all group"
              >
                <f.icon className="text-3xl text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Internal Import helper
import { FaShieldAlt } from "react-icons/fa";

export default SecuritySection;
