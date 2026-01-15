import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router";
import AssetCard from "../../../components/AssetCard";
import useAxiosPublic from "../../../hook/useAxiosPublic";

const RecentAssets = () => {
    const axiosPublic = useAxiosPublic();

    const { data: assets = [] } = useQuery({
        queryKey: ["recent-assets-home"],
        queryFn: async () => {
            const res = await axiosPublic.get("/assets");
            return res.data.slice(0, 4);
        }
    });

    if (assets.length === 0) return null;

    return (
        <section className="py-24 bg-base-100">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-xl">
                        <h2 className="text-4xl lg:text-5xl font-black mb-6 leading-tight">
                            Available <span className="text-primary italic">Now.</span>
                        </h2>
                        <p className="text-base-content/60 text-lg">
                            Take a look at some of the latest assets added to our platform. 
                            From high-end tech to office essentials, we manage it all.
                        </p>
                    </div>
                    <Link 
                        to="/assets" 
                        className="btn btn-ghost group gap-3 text-primary font-bold hover:bg-primary/5 transition-all"
                    >
                        Explore Catalog
                        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {assets.map((asset, idx) => (
                        <motion.div
                            key={asset._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <AssetCard asset={asset} detailsLink={`/assets/${asset._id}`} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RecentAssets;
