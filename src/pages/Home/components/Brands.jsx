import { motion } from "framer-motion";

const Brands = () => {
    const brands = [
        "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
        "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
        "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
        "https://upload.wikimedia.org/wikipedia/commons/b/b1/Apple_logo_white.svg",
        "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
        "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
    ];

    return (
        <section className="py-12 bg-base-100 border-b border-base-200">
            <div className="container mx-auto px-6 text-center">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-base-content/30 mb-10">
                    Empowering the world's most innovative teams
                </p>
                <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-20 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                    {brands.map((logo, idx) => (
                        <motion.img
                            key={idx}
                            src={logo}
                            alt="Brand Logo"
                            className="h-8 md:h-10 w-auto"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Brands;
