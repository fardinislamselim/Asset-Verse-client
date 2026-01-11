import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { FaBoxOpen, FaCheckCircle, FaStar } from "react-icons/fa";
import { useNavigate, useParams } from "react-router";
import useAuth from "../../hook/useAuth";
import useAxiosPublic from "../../hook/useAxiosPublic";
import useAxiosSecure from "../../hook/useAxiosSecure";

const AssetDetailsPublic = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure(); 
  const axiosPublic = useAxiosPublic();
  const [note, setNote] = useState("");
  const [requestLoading, setRequestLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const { data: asset, isPending, isError } = useQuery({
    queryKey: ["asset", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/assets/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const handleRequest = async () => {
    if (!user) {
        toast.error("You must be logged in to request an asset.");
        navigate("/login", { state: { from: `/assets/${id}` } });
        return;
    }

    if (!note.trim()) {
      toast.error("Please add a note to explain why you need this asset.");
      return;
    }

    setRequestLoading(true);
    try {
      await axiosSecure.post("/requests", {
        assetId: asset._id,
        assetName: asset.productName,
        assetType: asset.productType,
        companyName: asset.companyName,
        hrEmail: asset.hrEmail,
        requesterName: user.displayName,
        requesterEmail: user.email,
        note,
      });
      toast.success("Request sent successfully!");
      navigate("/employee/request-asset");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to send request.");
    } finally {
      setRequestLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (isError || !asset) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <h2 className="text-2xl font-bold text-error">Asset Not Found</h2>
        <button className="btn btn-primary rounded-field" onClick={() => navigate("/assets")}>
          Back to Assets
        </button>
      </div>
    );
  }

  const isOutOfStock = asset.availableQuantity <= 0;

  // Mock Data
  const galleryImages = [asset.productImage, asset.productImage, asset.productImage]; 
  const specs = [
    { label: "Asset Type", value: asset.productType },
    { label: "Quantity Available", value: asset.availableQuantity },
    { label: "Provider", value: asset.companyName },
    { label: "Date Added", value: new Date(asset.dateAdded).toLocaleDateString() },
    { label: "Location", value: "New York, USA" },
    { label: "Condition", value: "New / Excellent" },
  ];
  
  const reviews = [
    { id: 1, name: "Sarah J.", rating: 5, comment: "Excellent quality and fast approval process.", date: "2 days ago" },
    { id: 2, name: "Mike R.", rating: 4, comment: "Good asset, exactly as described.", date: "1 week ago" },
  ];

  return (
    <div className="bg-base-100 min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Navigation */}
        <button 
          onClick={() => navigate("/assets")} 
          className="btn btn-ghost hover:bg-base-200 gap-2 mb-8 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Assets
        </button>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            <figure className="aspect-square bg-base-200 rounded-2xl overflow-hidden shadow-sm border border-base-200 relative">
              <img
                src={asset.productImage}
                alt={asset.productName}
                className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
              />
              {isOutOfStock && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                  <span className="text-white font-bold text-xl uppercase tracking-widest border-2 border-white/50 px-6 py-2 rounded-full">
                    Out of Stock
                  </span>
                </div>
              )}
            </figure>
            <div className="grid grid-cols-3 gap-4">
              {galleryImages.map((img, idx) => (
                <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-base-200 cursor-pointer hover:ring-2 ring-primary transition-all">
                   <img src={img} alt="Thumbnail w-full h-full object-cover" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product Info & Request */}
          <div className="flex flex-col">
            <div className="mb-6">
               <div className="flex justify-between items-start mb-2">
                 <h1 className="text-3xl md:text-4xl font-black text-neutral">{asset.productName}</h1>
                  <span className={`badge ${asset.productType === "Returnable" ? "bg-green-100 text-green-700 border-0" : "bg-amber-100 text-amber-700 border-0"} badge-lg font-bold py-3`}>
                    {asset.productType === "Returnable" ? "Returnable" : "Non-Returnable"}
                  </span>
               </div>
               
               <div className="flex items-center gap-4 text-sm mb-6">
                 <div className="flex items-center gap-1 text-warning">
                   <FaStar /> <span className="font-bold text-neutral">4.8</span> <span className="text-gray-400">(24 reviews)</span>
                 </div>
                 <span className="text-gray-300">|</span>
                 <p className="text-gray-500 font-medium">{asset.companyName}</p>
                 <span className="text-gray-300">|</span>
                 <p className="text-primary font-bold">Official Asset</p>
               </div>

               <div className="text-3xl font-bold text-primary mb-6">
                 High Priority
                 <span className="text-sm font-normal text-gray-400 ml-2">tier</span>
               </div>
            </div>

            {/* Request Form Section */}
            <div className="card bg-base-100 shadow-xl border border-base-200 p-6 flex-grow">
               <h3 className="card-title text-lg mb-4">Request This Asset</h3>
               
               {user ? (
                <div className="form-control w-full space-y-4">
                    <div className="space-y-1">
                      <label className="label py-0">
                         <span className="label-text font-semibold">Purpose of Request</span>
                         <span className="label-text-alt text-error">* Required</span>
                      </label>
                      <textarea
                        className="textarea textarea-bordered w-full h-28 focus:border-primary resize-none"
                        placeholder="Please briefly explain why you need this asset..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        disabled={isOutOfStock}
                      ></textarea>
                    </div>

                    <button
                      onClick={handleRequest}
                      className="btn btn-primary btn-lg w-full rounded-field shadow-lg shadow-primary/20"
                      disabled={isOutOfStock || requestLoading}
                    >
                      {requestLoading ? <span className="loading loading-spinner"></span> : isOutOfStock ? "Unavailable" : "Submit Request"}
                    </button>
                    {!isOutOfStock && <p className="text-xs text-center text-gray-400">Approval usually takes 24-48 hours.</p>}
                </div>
              ) : (
                <div className="text-center py-6">
                   <div className="mx-auto bg-base-200 w-16 h-16 rounded-full flex items-center justify-center mb-4 text-2xl">🔒</div>
                   <h4 className="font-bold mb-2">Login Required</h4>
                   <p className="text-gray-500 text-sm mb-6">You must be logged in as an employee to request assets.</p>
                   <button
                        onClick={() => navigate("/login", { state: { from: `/assets/${id}` } })}
                        className="btn btn-primary btn-block rounded-field"
                    >
                        Login to Continue
                    </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="mb-20">
          <div className="flex gap-8 border-b border-base-200 mb-8 overflow-x-auto">
            {["overview", "specifications", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-2 font-bold capitalize transition-colors relative whitespace-nowrap ${
                  activeTab === tab ? "text-primary" : "text-gray-400 hover:text-neutral"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
                )}
              </button>
            ))}
          </div>

          <div className="min-h-[200px]">
            {activeTab === "overview" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="prose max-w-none">
                 <p className="text-xl text-neutral font-medium mb-4">
                   Premium {asset.productType.toLowerCase()} designed for professional productivity.
                 </p>
                 <p className="text-gray-500 leading-relaxed mb-4">
                   This {asset.productName} represents the standard for corporate assets provided by {asset.companyName}. 
                   It comes with full warranty support and is maintained by our IT department to ensure optimal performance.
                   Suitable for everyday office tasks, remote work, and specialized projects.
                 </p>
                 <ul className="space-y-2 mt-4 text-gray-600">
                    <li className="flex items-center gap-2"><FaCheckCircle className="text-success" /> Verified working condition</li>
                    <li className="flex items-center gap-2"><FaCheckCircle className="text-success" /> Latest software updates installed</li>
                    <li className="flex items-center gap-2"><FaCheckCircle className="text-success" /> Sanitized and packaged</li>
                 </ul>
              </motion.div>
            )}

            {activeTab === "specifications" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-6 bg-base-100 p-8 rounded-2xl border border-base-200">
                 {specs.map((item, idx) => (
                   <div key={idx} className="flex justify-between border-b border-base-200 pb-3 last:border-0 last:pb-0">
                      <span className="font-semibold text-gray-500">{item.label}</span>
                      <span className="font-bold text-neutral">{item.value}</span>
                   </div>
                 ))}
              </motion.div>
            )}

            {activeTab === "reviews" && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="flex gap-4 p-6 rounded-2xl bg-base-200/50">
                       <div className="avatar placeholder">
                          <div className="bg-primary text-primary-content rounded-full w-12">
                             <span>{review.name.charAt(0)}</span>
                          </div>
                       </div>
                       <div>
                          <div className="flex items-center gap-2 mb-1">
                             <h4 className="font-bold">{review.name}</h4>
                             <span className="text-xs text-gray-400">• {review.date}</span>
                          </div>
                          <div className="flex text-warning text-sm mb-2">
                             {[...Array(5)].map((_, i) => (
                               <FaStar key={i} className={i < review.rating ? "" : "text-gray-300"} />
                             ))}
                          </div>
                          <p className="text-gray-600">{review.comment}</p>
                       </div>
                    </div>
                  ))}
               </motion.div>
            )}
          </div>
        </div>

        {/* Related Assets */}
        <div className="mb-12">
           <h3 className="text-2xl font-bold mb-8">Related Assets</h3>
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                 <div key={item} className="card bg-base-100 shadow-lg border border-base-200 hover:shadow-xl transition-all">
                    <figure className="h-40 bg-gray-100 relative">
                       <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-4xl">
                         <FaBoxOpen />
                       </div>
                    </figure>
                    <div className="card-body p-4">
                       <h4 className="font-bold text-lg mb-1">Related Asset #{item}</h4>
                       <p className="text-xs text-gray-500 mb-4">Similar to {asset.productName}</p>
                       <button className="btn btn-outline btn-sm w-full rounded-field">View Details</button>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDetailsPublic;
