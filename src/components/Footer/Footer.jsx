import {
    FaEnvelope,
    FaFacebookF,
    FaGithub,
    FaLinkedinIn,
    FaMapMarkerAlt,
    FaPhone,
    FaTwitter
} from "react-icons/fa";
import { Link } from "react-router";
import logo from "../../assets/logo.png";
import Container from "../Container/Container";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Platform",
      links: [
        { name: "Available Assets", path: "/assets" },
        { name: "Subscription Plans", path: "/#packages" },
        { name: "How It Works", path: "/#how-it-works" },
        { name: "Security & Privacy", path: "/#security" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About AssetVerse", path: "/#about" },
        { name: "Our Features", path: "/#features" },
        { name: "Success Stories", path: "/#testimonials" },
        { name: "Contact Support", path: "/#contact" },
      ],
    },
  ];

  const socialLinks = [
    { icon: FaTwitter, path: "https://twitter.com", color: "hover:bg-[#1DA1F2]", label: "Twitter" },
    { icon: FaLinkedinIn, path: "https://linkedin.com", color: "hover:bg-[#0A66C2]", label: "LinkedIn" },
    { icon: FaGithub, path: "https://github.com", color: "hover:bg-[#333]", label: "GitHub" },
    { icon: FaFacebookF, path: "https://facebook.com", color: "hover:bg-[#1877F2]", label: "Facebook" },
  ];

  return (
    <footer className="bg-neutral text-neutral-content pt-20 pb-10 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-secondary/5 rounded-full blur-3xl opacity-50"></div>

      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 relative z-10">
          {/* Brand & Mission */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <img src={logo} alt="Logo" className="w-10 h-10 object-contain group-hover:scale-105 transition-transform" />
              <span className="text-2xl font-black tracking-tighter text-white">
                Asset<span className="text-primary">Verse</span>
              </span>
            </Link>
            <p className="text-gray-400 leading-relaxed text-sm max-w-xs">
              We empower organizations with next-gen asset tracking solutions, 
              ensuring 100% accountability and operational excellence.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 border border-white/10 flex items-center justify-center rounded-xl transition-all duration-300 group ${social.color}`}
                  aria-label={social.label}
                >
                  <social.icon className="group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Dynamic Link Groups */}
          {footerLinks.map((group, idx) => (
            <div key={idx} className="space-y-6">
              <h3 className="text-lg font-bold text-white border-l-4 border-primary pl-3 tracking-wide uppercase text-xs">
                {group.title}
              </h3>
              <ul className="space-y-4">
                {group.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-primary hover:translate-x-1 transition-all inline-block text-sm font-medium"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white border-l-4 border-primary pl-3 tracking-wide uppercase text-xs">
              Connect With Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/5 flex items-center justify-center rounded-lg text-primary mt-1">
                  <FaEnvelope className="text-sm" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black tracking-widest text-gray-500 mb-1">Email Support</p>
                  <a href="mailto:support@assetverse.com" className="text-sm text-gray-400 hover:text-primary transition-colors">
                    support@assetverse.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/5 flex items-center justify-center rounded-lg text-primary mt-1">
                  <FaPhone className="text-sm" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black tracking-widest text-gray-500 mb-1">Call Anywhere</p>
                  <a href="tel:+15551234567" className="text-sm text-gray-400 hover:text-primary transition-colors">
                    +1 (555) 123-4567
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/5 flex items-center justify-center rounded-lg text-primary mt-1">
                  <FaMapMarkerAlt className="text-sm" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black tracking-widest text-gray-500 mb-1">Headquarters</p>
                  <p className="text-sm text-gray-400">123 Asset Ave, San Francisco, CA</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-gray-500 relative z-10">
          <p>© {currentYear} <span className="text-white font-bold">AssetVerse Inc.</span> Crafted for operational excellence.</p>
          <div className="flex gap-6 uppercase tracking-widest text-[10px]">
            <Link to="/#security" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/#security" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/#faq" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;

