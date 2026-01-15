import toast from "react-hot-toast";
import { FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaPhoneAlt } from "react-icons/fa";
import Container from "../../components/Container/Container";

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent successfully! We'll be in touch.");
    e.target.reset();
  };

  return (
    <div className="bg-base-200/50 min-h-screen pt-24 pb-20">
      <Container>
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black mb-4">Get in Touch</h1>
          <p className="text-base-content/60 max-w-xl mx-auto">
            Have questions about our enterprise plans or need technical help? 
            Our team usually responds within 2 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 bg-base-100 p-8 lg:p-12 rounded-[3rem] shadow-2xl border border-base-200">
          {/* Contact Info */}
          <div className="lg:col-span-5 space-y-10">
            <div>
              <h2 className="text-3xl font-bold mb-8">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex gap-6 items-start group">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-xl group-hover:bg-primary group-hover:text-white transition-all">
                    <FaPhoneAlt />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Call Us</h4>
                    <p className="text-base-content/60 font-medium">+1 (888) ASSET-VR</p>
                  </div>
                </div>

                <div className="flex gap-6 items-start group">
                  <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary text-xl group-hover:bg-secondary group-hover:text-white transition-all">
                    <FaEnvelope />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Email Us</h4>
                    <p className="text-base-content/60 font-medium">support@assetverse.io</p>
                  </div>
                </div>

                <div className="flex gap-6 items-start group">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent text-xl group-hover:bg-accent group-hover:text-white transition-all">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Visit Us</h4>
                    <p className="text-base-content/60 font-medium">123 Tech Avenue, Silicon Valley, CA</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-base-200 p-8 rounded-3xl border border-base-300">
              <h4 className="font-bold mb-2">Office Hours</h4>
              <p className="text-sm text-base-content/60">Monday - Friday: 9am - 6pm EST</p>
              <p className="text-sm text-base-content/60">Weekend: Closed (Email Support Only)</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
              <div className="form-control col-span-1">
                <label className="label text-xs font-black uppercase opacity-50">First Name</label>
                <input type="text" placeholder="John" required className="input input-bordered w-full rounded-2xl border-base-300 focus:ring-2 focus:ring-primary/20 h-14" />
              </div>
              <div className="form-control col-span-1">
                <label className="label text-xs font-black uppercase opacity-50">Last Name</label>
                <input type="text" placeholder="Doe" required className="input input-bordered w-full rounded-2xl border-base-300 focus:ring-2 focus:ring-primary/20 h-14" />
              </div>
              <div className="form-control col-span-2">
                <label className="label text-xs font-black uppercase opacity-50">Email Address</label>
                <input type="email" placeholder="john@example.com" required className="input input-bordered w-full rounded-2xl border-base-300 focus:ring-2 focus:ring-primary/20 h-14" />
              </div>
              <div className="form-control col-span-2">
                <label className="label text-xs font-black uppercase opacity-50">Subject</label>
                <select className="select select-bordered w-full rounded-2xl border-base-300 h-14">
                  <option>General Inquiry</option>
                  <option>Bug Report</option>
                  <option>Sales & Partnerships</option>
                  <option>Billing Question</option>
                </select>
              </div>
              <div className="form-control col-span-2">
                <label className="label text-xs font-black uppercase opacity-50">Message</label>
                <textarea required className="textarea textarea-bordered w-full rounded-2xl border-base-300 focus:ring-2 focus:ring-primary/20 h-40" placeholder="Tell us how we can help..."></textarea>
              </div>
              <div className="col-span-2 text-right">
                <button type="submit" className="btn btn-primary btn-lg rounded-2xl w-full sm:w-auto px-10 gap-3 group">
                  Send Message
                  <FaPaperPlane className="text-sm group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Contact;
