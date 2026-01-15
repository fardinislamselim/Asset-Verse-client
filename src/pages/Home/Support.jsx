import toast from "react-hot-toast";
import { FaBook, FaComments, FaQuestionCircle, FaSearch, FaVideo } from "react-icons/fa";
import Container from "../../components/Container/Container";

const Support = () => {
  const handleCategoryClick = (title) => {
    toast.success(`Loading articles for: ${title}`);
  };

  const handleTicketClick = () => {
    toast.success("Opening support ticket portal...");
  };

  const categories = [
    { title: "Getting Started", icon: <FaRocket className="text-3xl text-primary" />, count: 12 },
    { title: "Managing Assets", icon: <FaBook className="text-3xl text-secondary" />, count: 24 },
    { title: "Team & Roles", icon: <FaComments className="text-3xl text-accent" />, count: 15 },
    { title: "Billing & Plans", icon: <FaSearch className="text-3xl text-warning" />, count: 8 },
  ];
// ... existing faqs ...
  const faqs = [
    { q: "How do I add a new employee?", a: "Go to your HR dashboard, select 'Add Employee', and enter their details. They will receive an email to join your team." },
    { q: "Can I track asset history?", a: "Yes, every asset has a detailed logs section showing who requested it and when it was returned." },
    { q: "Is there a mobile app?", a: "AssetVerse is a Progressive Web App (PWA). You can install it on your home screen for a native experience." },
  ];

  return (
    <div className="bg-base-100 min-h-screen pt-24 lg:pt-32 pb-20">
      <Container>
        {/* Search Header */}
        <div className="bg-primary/5 rounded-[4rem] px-8 py-20 text-center mb-20 relative overflow-hidden border border-primary/10">
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <FaQuestionCircle className="text-[15rem]" />
          </div>
          <h1 className="text-5xl font-black mb-6">How can we help?</h1>
          <div className="max-w-2xl mx-auto relative group">
             <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-primary text-xl group-focus-within:scale-110 transition-transform" />
             <input 
                type="text" 
                placeholder="Search for articles, guides, or keywords..." 
                className="input input-lg w-full pl-16 pr-6 h-18 rounded-3xl shadow-xl border-none focus:ring-4 focus:ring-primary/20"
             />
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
           {categories.map((cat, idx) => (
             <div 
               key={idx} 
               onClick={() => handleCategoryClick(cat.title)}
               className="card bg-base-100 shadow-xl hover:shadow-2xl border border-base-200 transition-all cursor-pointer group hover:-translate-y-1"
             >
               <div className="card-body items-center text-center p-10">
                 <div className="w-16 h-16 rounded-2xl bg-base-200 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                    {cat.icon}
                 </div>
                 <h3 className="card-title mb-1">{cat.title}</h3>
                 <p className="text-sm font-bold text-base-content/40 uppercase tracking-widest">{cat.count} Articles</p>
               </div>
             </div>
           ))}
        </div>

        {/* FAQ Section */}
        <div className="grid lg:grid-cols-12 gap-16 mb-24">
           {/* ... existing faq layout ... */}
           <div className="lg:col-span-5">
              <h2 className="text-4xl font-bold mb-6">Frequently Asked Questions</h2>
              <p className="text-lg text-base-content/60 mb-8 leading-relaxed">
                Can't find what you're looking for? Browse these common questions or connect with a support specialist.
              </p>
              <div className="space-y-4">
                 <div className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/5 border border-secondary/10 cursor-pointer hover:bg-secondary/10 transition-colors" onClick={() => toast.success("Opening video gallery...")}>
                    <FaVideo className="text-secondary text-2xl" />
                    <div>
                        <h4 className="font-bold">Video Tutorials</h4>
                        <p className="text-sm opacity-60">Watch step-by-step guides</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 p-4 rounded-2xl bg-accent/5 border border-accent/10 cursor-pointer hover:bg-accent/10 transition-colors" onClick={() => toast.success("Starting live chat...")}>
                    <FaComments className="text-accent text-2xl" />
                    <div>
                        <h4 className="font-bold">Live Chat</h4>
                        <p className="text-sm opacity-60">Available 24/7 for Enterprise</p>
                    </div>
                 </div>
              </div>
           </div>
           
           <div className="lg:col-span-7">
              <div className="space-y-4">
                 {faqs.map((faq, idx) => (
                   <div key={idx} className="collapse collapse-plus bg-base-200 rounded-3xl border border-base-300">
                     <input type="radio" name="my-accordion-3" defaultChecked={idx === 0} /> 
                     <div className="collapse-title text-xl font-bold p-6">
                       {faq.q}
                     </div>
                     <div className="collapse-content px-6 pb-6 opacity-70"> 
                       <p>{faq.a}</p>
                     </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* CTA */}
        <div className="bg-neutral text-neutral-content rounded-[3rem] p-12 text-center lg:flex items-center justify-between gap-10">
           <div className="text-left max-w-xl">
              <h2 className="text-3xl font-bold mb-2 text-white">Still stuck? No worries.</h2>
              <p className="text-gray-400">Our support engineers are ready to dive in and solve any issue you might have.</p>
           </div>
           <button onClick={handleTicketClick} className="btn btn-primary btn-lg rounded-2xl px-12 mt-6 lg:mt-0 font-bold whitespace-nowrap">Open Support Ticket</button>
        </div>
      </Container>
    </div>
  );
};

// Internal icon for Rocket since I reused cat.icon
const FaRocket = ({ className }) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className={className} height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path d="M505.1201,19.0933c-1.1891-1.1925-2.8596-1.8432-4.5882-1.7393c-23.0113,1.383-223.3664,13.8833-317.4042,130.6385 c-16.1481,20.0493-27.5135,42.5273-33.8277,66.82 c-45.7262-11.4116-89.4449-3.8824-118.57,28.79 c-0.6358,0.7132-0.6358,1.7891,0,2.5023c1.609,1.805,42.3653,46.9696,110.0381,61.9961 c-23.3364,28.4357-123.642,176.4716-123.642,176.4716c-1.2842,1.8491-1.2598,4.3204,0.063,6.1396l9.9922,13.7383 c0.7788,1.071,2.0229,1.7,3.3423,1.7s2.5635-0.629,3.3423-1.7l176.438-204.646c0,0,147.9351-100.2075,176.3662-123.518 c15.0298,67.6358,60.2065,108.3843,62.0117,109.9927c0.7134,0.635,1.7896,0.635,2.503,0c32.6582-29.1118,40.1983-72.8091,28.8042-118.5259 c24.2988-6.314,46.7861-17.6792,66.8398-33.8247c116.8926-94.1201,129.3877-294.5029,130.7046-317.5132 C506.9634,21.9542,506.3115,20.2833,505.1201,19.0933z"></path>
  </svg>
);

export default Support;
