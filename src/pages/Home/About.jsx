import { FaAward, FaGlobe, FaRocket, FaUsers } from "react-icons/fa";
import Container from "../../components/Container/Container";

const About = () => {
  const stats = [
    { label: "Active Users", value: "50k+", icon: <FaUsers className="text-primary" /> },
    { label: "Companies", value: "1.2k+", icon: <FaGlobe className="text-secondary" /> },
    { label: "Assets Managed", value: "500k+", icon: <FaRocket className="text-accent" /> },
    { label: "Awards Won", value: "12", icon: <FaAward className="text-warning" /> },
  ];

  const team = [
    { name: "John Doe", role: "CEO & Founder", img: "https://i.pravatar.cc/150?u=john" },
    { name: "Jane Smith", role: "CTO", img: "https://i.pravatar.cc/150?u=jane" },
    { name: "Mike Ross", role: "Head of Product", img: "https://i.pravatar.cc/150?u=mike" },
  ];

  return (
    <div className="bg-base-100 min-h-screen pt-24 pb-20">
      <Container>
        {/* Hero Section */}
        <section className="text-center mb-20">
          <h1 className="text-5xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Our Mission
          </h1>
          <p className="text-xl text-base-content/70 max-w-3xl mx-auto leading-relaxed">
            We're on a journey to revolutionize how companies manage their growing physical and digital inventory. 
            AssetVerse is built to bring transparency, efficiency, and scale to modern workplaces.
          </p>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-base-200 p-8 rounded-3xl border border-base-300 text-center hover:shadow-xl transition-all group overflow-hidden relative">
              <div className="absolute -bottom-4 -right-4 text-primary/5 text-8xl transition-transform group-hover:scale-110">
                  {stat.icon}
              </div>
              <div className="text-4xl font-black text-base-content mb-2">{stat.value}</div>
              <div className="text-sm font-bold uppercase tracking-widest text-base-content/50">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Text Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">Why AssetVerse?</h2>
            <p className="text-lg text-base-content/70">
              Founded in 2024, we noticed that small to medium businesses were struggling with messy spreadsheets 
              and lost equipment. We wanted to build a tool that feels premium yet remains accessible to everyone.
            </p>
            <ul className="space-y-4">
               <li className="flex items-center gap-3 font-semibold">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">✓</div>
                  Real-time stock tracking
               </li>
               <li className="flex items-center gap-3 font-semibold">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">✓</div>
                  AI-driven return reminders
               </li>
               <li className="flex items-center gap-3 font-semibold">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">✓</div>
                  Seamless team onboarding
               </li>
            </ul>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-primary/10 rounded-[3rem] blur-2xl"></div>
            <img 
              src="https://images.unsplash.com/photo-1522071823991-b9671f9d7f1f?auto=format&fit=crop&q=80&w=800" 
              alt="Team working" 
              className="rounded-[2.5rem] shadow-2xl relative z-10"
            />
          </div>
        </div>

        {/* Team Section */}
        <section>
          <h2 className="text-4xl font-bold text-center mb-12">Meet the Visionaries</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {team.map((member, idx) => (
              <div key={idx} className="bg-base-100 rounded-3xl p-6 shadow-xl border border-base-200 text-center hover:-translate-y-2 transition-transform">
                <img src={member.img} alt={member.name} className="w-24 h-24 rounded-2xl mx-auto mb-4 object-cover ring-4 ring-primary/10" />
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-primary font-medium">{member.role}</p>
              </div>
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
};

export default About;
