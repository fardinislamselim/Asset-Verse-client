import { motion } from "framer-motion";
import { FaDropbox, FaFigma, FaGithub, FaGoogleDrive, FaJira, FaSlack } from "react-icons/fa";
import { SiNotion, SiTrello } from "react-icons/si";

const Integrations = () => {
    const tools = [
        { name: "Slack", icon: FaSlack, color: "text-[#4A154B]" },
        { name: "Jira", icon: FaJira, color: "text-[#0052CC]" },
        { name: "GitHub", icon: FaGithub, color: "text-[#181717]" },
        { name: "Dropbox", icon: FaDropbox, color: "text-[#0061FF]" },
        { name: "Figma", icon: FaFigma, color: "text-[#F24E1E]" },
        { name: "Google Drive", icon: FaGoogleDrive, color: "text-[#4285F4]" },
        { name: "Notion", icon: SiNotion, color: "text-[#000000]" },
        { name: "Trello", icon: SiTrello, color: "text-[#0079BF]" },
    ];

    return (
        <section className="py-24 bg-neutral text-neutral-content relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-4xl lg:text-5xl font-black mb-6">
                        Works with your <span className="text-primary italic">Workflow.</span>
                    </h2>
                    <p className="max-w-2xl mx-auto text-gray-400 text-lg">
                        AssetVerse syncs with the tools your team already uses every day. 
                        No need to switch tabs or change your habits.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {tools.map((tool, idx) => (
                        <motion.div
                            key={tool.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            viewport={{ once: true }}
                            className="bg-white/5 border border-white/10 p-8 rounded-3xl flex flex-col items-center gap-4 hover:bg-white/10 hover:border-primary/50 transition-all group"
                        >
                            <tool.icon className={`text-5xl ${tool.color} group-hover:rotate-12 transition-transform`} />
                            <span className="font-bold text-lg">{tool.name}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Integrations;
