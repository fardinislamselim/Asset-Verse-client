import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaCalendarAlt, FaMapMarkerAlt, FaStar, FaTag } from "react-icons/fa";
import { Link } from "react-router";

// Mock Data Generator for Demonstration
const generateMockListings = () => {
  return Array.from({ length: 8 }).map((_, i) => ({
    id: i + 1,
    title: `Premium Asset ${i + 1}`,
    image: `https://images.unsplash.com/photo-${
      [
        "1554995207-c18c203602cb",
        "1512917774080-9991f1c4c750",
        "1486312338219-ce68d2c6f44d",
        "1531297461362-76ce1f9ddf43",
      ][i % 4]
    }?auto=format&fit=crop&q=80&w=800`,
    description: "High-performance asset with advanced tracking capabilities and superior durability for enterprise calls.",
    price: (Math.random() * 500 + 100).toFixed(2),
    rating: (Math.random() * 1.5 + 3.5).toFixed(1),
    location: ["New York, NY", "London, UK", "Tokyo, JP", "Berlin, DE"][i % 4],
    date: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString(),
  }));
};

const ListingSection = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate API Call
  useEffect(() => {
    const timer = setTimeout(() => {
      setListings(generateMockListings());
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-24 bg-base-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-neutral mb-4"
          >
            Featured Assets
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 max-w-2xl mx-auto"
          >
            Explore our top-rated assets available for immediate deployment. 
            Tracked, managed, and optimized for your business.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? // Skeleton Loader
              Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="card bg-base-100 shadow-xl border border-base-200 h-full">
                  <div className="h-56 bg-base-200 animate-pulse rounded-t-box w-full" />
                  <div className="card-body p-5 space-y-3">
                    <div className="h-6 bg-base-200 animate-pulse rounded w-3/4" />
                    <div className="h-4 bg-base-200 animate-pulse rounded w-full" />
                    <div className="h-4 bg-base-200 animate-pulse rounded w-2/3" />
                    <div className="flex gap-2 mt-4">
                      <div className="h-4 bg-base-200 animate-pulse rounded w-1/3" />
                      <div className="h-4 bg-base-200 animate-pulse rounded w-1/3" />
                    </div>
                    <div className="h-10 bg-base-200 animate-pulse rounded-field w-full mt-4" />
                  </div>
                </div>
              ))
            : // Actual Cards
              listings.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  viewport={{ once: true }}
                  className="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 border border-base-200 group h-full flex flex-col"
                >
                  <figure className="relative h-56 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 right-3 bg-base-100/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold shadow-sm flex items-center gap-1">
                      <FaStar className="text-warning" />
                      {item.rating}
                    </div>
                  </figure>
                  
                  <div className="card-body p-5 flex-grow">
                    <h3 className="card-title text-lg font-bold text-neutral group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3 flex-grow-0">
                      {item.description}
                    </p>

                    <div className="grid grid-cols-2 gap-y-2 text-xs text-gray-500 mt-auto mb-4 border-t border-base-200 pt-3">
                      <div className="flex items-center gap-1.5">
                        <FaTag className="text-primary" />
                        <span>${item.price}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FaCalendarAlt className="text-primary" />
                        <span>{item.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5 col-span-2">
                        <FaMapMarkerAlt className="text-primary" />
                        <span>{item.location}</span>
                      </div>
                    </div>

                    <div className="card-actions">
                      <Link 
                        to={`/assets/${item.id}`}
                        className="btn btn-primary btn-block rounded-field shadow-lg shadow-primary/20"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
        </div>
        
        {!loading && (
          <div className="text-center mt-12">
            <Link to="/assets" className="btn btn-outline btn-wide rounded-field">
              View All Assets
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ListingSection;
