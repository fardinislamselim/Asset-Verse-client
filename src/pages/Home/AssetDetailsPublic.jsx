import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  FaArrowLeft,
  FaArrowRight,
  FaBox,
  FaClipboardList,
  FaComments,
  FaInfoCircle,
  FaShieldAlt,
  FaStar,
  FaTruck
} from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router";
import AssetCard from "../../components/AssetCard";
import useAuth from "../../hook/useAuth";
import useAxiosPublic from "../../hook/useAxiosPublic";
import useAxiosSecure from "../../hook/useAxiosSecure";

const AssetDetailsPublic = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const queryClient = useQueryClient();

  const [note, setNote] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [requestLoading, setRequestLoading] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);

  // Queries
  const { data: asset, isPending: assetPending } = useQuery({
    queryKey: ["asset", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/assets/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const { data: reviews = [], isPending: reviewsPending } = useQuery({
    queryKey: ["asset-reviews", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/assets/${id}/reviews`);
      return res.data;
    },
    enabled: !!id,
  });

  const { data: related = [], isPending: relatedPending } = useQuery({
    queryKey: ["asset-related", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/assets/${id}/related`);
      return res.data;
    },
    enabled: !!id,
  });

  // Review Mutation
  const reviewMutation = useMutation({
    mutationFn: async (newReview) => {
      return axiosSecure.post(`/assets/${id}/reviews`, newReview);
    },
    onSuccess: () => {
      toast.success("Review posted successfully!");
      setReviewComment("");
      setReviewRating(5);
      queryClient.invalidateQueries(["asset-reviews", id]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to post review");
    }
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
      toast.error(err.response?.data?.message || "Failed to send request.");
    } finally {
      setRequestLoading(false);
    }
  };

  const handlePostReview = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to post a review");
      return;
    }
    reviewMutation.mutate({ rating: reviewRating, comment: reviewComment });
  };

  if (assetPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <h2 className="text-2xl font-bold text-error">Asset Not Found</h2>
        <button className="btn btn-primary" onClick={() => navigate("/assets")}>
          Back to Assets
        </button>
      </div>
    );
  }

  const isOutOfStock = asset.availableQuantity <= 0;
  
  // Media Gallery (Mocked if only one image exists)
  const images = [
    asset.productImage,
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1926&auto=format&fit=crop"
  ];

  const specs = [
    { label: "Model Year", value: asset.dateAdded?.split('-')[0] || "2024" },
    { label: "Category", value: asset.productType },
    { label: "Condition", value: "Premium" },
    { label: "Provider", value: asset.companyName },
    { label: "Global Stock", value: asset.availableQuantity > 50 ? "High" : "Controlled" },
    { label: "Support", value: "24/7 Corporate" }
  ];

  return (
    <div className="bg-base-200/50 min-h-screen pb-20 pt-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Navigation */}
        <button 
          onClick={() => navigate(-1)} 
          className="btn btn-ghost btn-sm mb-8 hover:bg-base-300 gap-2 font-semibold"
        >
          <FaArrowLeft /> Back to Exploration
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Media Gallery */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-base-100 p-2 rounded-3xl shadow-xl border border-base-200 overflow-hidden">
              <figure className="relative aspect-video rounded-2xl overflow-hidden group">
                <img
                  src={images[selectedImage]}
                  alt={asset.productName}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className={`badge lg:badge-lg ${asset.productType === "Returnable" ? "badge-success" : "badge-secondary"} border-none shadow-lg font-bold`}>
                    {asset.productType}
                  </span>
                </div>
              </figure>
            </div>
            
            {/* Gallery Thumbnails */}
            <div className="flex gap-4 p-2 overflow-x-auto pb-4 pt-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedImage === idx ? "border-primary scale-105 shadow-md" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Tabs Section */}
            <div className="bg-base-100 rounded-3xl shadow-lg border border-base-200 overflow-hidden mt-8">
              <div className="flex border-b border-base-200">
                {[
                  { id: "overview", label: "Overview", icon: <FaInfoCircle /> },
                  { id: "specs", label: "Specifications", icon: <FaClipboardList /> },
                  { id: "reviews", label: "Reviews", icon: <FaComments /> }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-5 font-bold transition-all ${
                      activeTab === tab.id 
                      ? "text-primary border-b-4 border-primary bg-primary/5" 
                      : "text-base-content/60 hover:text-base-content hover:bg-base-200"
                    }`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-8">
                {activeTab === "overview" && (
                  <div className="animate-fadeIn">
                    <h3 className="text-2xl font-bold mb-4">Description</h3>
                    <p className="text-lg leading-relaxed text-base-content/70">
                      The <span className="text-primary font-bold">{asset.productName}</span> is a top-tier corporate asset managed by <span className="font-semibold">{asset.companyName}</span>. 
                      Designed for high-performance professional environments, this {asset.productType.toLowerCase()} item meets all modern industry standards.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                      <div className="flex items-start gap-4 p-4 bg-base-200 rounded-2xl">
                        <div className="p-3 bg-success/20 rounded-xl text-success"><FaShieldAlt size={24}/></div>
                        <div>
                          <h4 className="font-bold">Security Grade</h4>
                          <p className="text-sm opacity-70">Fully encrypted and ready for secure workspace integration.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 bg-base-200 rounded-2xl">
                        <div className="p-3 bg-info/20 rounded-xl text-info"><FaTruck size={24}/></div>
                        <div>
                          <h4 className="font-bold">Fast Deployment</h4>
                          <p className="text-sm opacity-70">Available for immediate request and pickup within 24 hours.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "specs" && (
                  <div className="animate-fadeIn grid grid-cols-1 md:grid-cols-2 gap-4">
                    {specs.map((spec, i) => (
                      <div key={i} className="flex justify-between p-4 border-b border-base-200 last:border-0">
                        <span className="font-medium text-base-content/60">{spec.label}</span>
                        <span className="font-bold text-base-content">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="animate-fadeIn space-y-8">
                    {/* Review Form */}
                    {user ? (
                      <div className="bg-base-200 p-6 rounded-2xl shadow-inner border border-base-300">
                        <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                           Add a Review
                        </h4>
                        <form onSubmit={handlePostReview} className="space-y-4">
                           <div className="flex gap-2">
                              {[1, 2, 3, 4, 5].map((s) => (
                                 <button 
                                    key={s} 
                                    type="button" 
                                    onClick={() => setReviewRating(s)}
                                    className={`btn btn-circle btn-sm ${reviewRating >= s ? "btn-warning" : "btn-ghost"}`}
                                 >
                                    <FaStar />
                                 </button>
                              ))}
                           </div>
                           <textarea
                              className="textarea textarea-bordered w-full h-24 focus:ring-2 focus:ring-primary/20"
                              placeholder="Share your experience with this asset..."
                              required
                              value={reviewComment}
                              onChange={(e) => setReviewComment(e.target.value)}
                           ></textarea>
                           <button 
                              type="submit" 
                              className="btn btn-primary btn-sm rounded-xl px-8"
                              disabled={reviewMutation.isLoading}
                           >
                              Post Review
                           </button>
                        </form>
                      </div>
                    ) : (
                      <div className="alert alert-info rounded-2xl">
                        <span>Please login to share your reviews.</span>
                      </div>
                    )}

                    {/* Review List */}
                    <div className="space-y-6">
                      {reviews.length === 0 ? (
                        <div className="text-center py-10 opacity-50">
                          <FaComments size={48} className="mx-auto mb-2" />
                          <p>No reviews yet. Be the first to share!</p>
                        </div>
                      ) : (
                        reviews.map((r) => (
                          <div key={r._id} className="flex gap-4 p-6 bg-base-100 border border-base-200 rounded-2xl shadow-sm transition-hover hover:shadow-md">
                            <div className="avatar">
                              <div className="w-12 h-12 rounded-full border-2 border-primary/20">
                                <img src={r.userImage || `https://ui-avatars.com/api/?name=${r.userName}`} alt="" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h5 className="font-bold text-lg">{r.userName}</h5>
                                  <div className="flex text-warning text-sm mb-2">
                                    {[...Array(5)].map((_, i) => (
                                      <FaStar key={i} className={i < r.rating ? "fill-current" : "opacity-20"} />
                                    ))}
                                  </div>
                                </div>
                                <span className="text-xs opacity-50">{new Date(r.createdAt).toLocaleDateString()}</span>
                              </div>
                              <p className="text-base-content/80 pt-2 italic">"{r.comment}"</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Request Card */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-6">
              <div className="bg-base-100 p-8 rounded-[2rem] shadow-2xl border border-base-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10"></div>
                
                <header className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-primary uppercase tracking-widest">{asset.companyName}</span>
                    <div className="flex items-center gap-1 text-warning font-bold">
                       <FaStar /> 4.8
                    </div>
                  </div>
                  <h1 className="text-4xl font-extrabold text-base-content mb-4">{asset.productName}</h1>
                  <div className="flex items-center gap-4 text-sm font-medium">
                    <div className="flex items-center gap-1 text-success">
                       <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                       Available Now
                    </div>
                    <div className="text-base-content/40">|</div>
                    <div className="flex items-center gap-1 opacity-60">
                       <FaBox /> {asset.availableQuantity} Items Left
                    </div>
                  </div>
                </header>

                <div className="divider opacity-50"></div>

                {/* Request Form */}
                <div className="space-y-6">
                  {user ? (
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-bold text-lg">Justification Note</span>
                        <span className="label-text-alt text-error font-semibold">Required</span>
                      </label>
                      <textarea
                        className="textarea textarea-bordered h-40 rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all text-lg"
                        placeholder="Provide a brief explanation for this request..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        disabled={isOutOfStock}
                      ></textarea>
                    </div>
                  ) : (
                    <div className="alert alert-warning rounded-2xl shadow-inner border-none bg-warning/20 text-warning-content font-bold">
                      <FaInfoCircle size={20} />
                      <span>Action restricted to authenticated personnel.</span>
                    </div>
                  )}

                  <div className="pt-2">
                    {user ? (
                      <button
                        onClick={handleRequest}
                        className={`btn btn-primary btn-lg w-full rounded-2xl font-black text-xl shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95 ${
                          requestLoading ? "loading" : ""
                        }`}
                        disabled={isOutOfStock || requestLoading}
                      >
                        {isOutOfStock ? "ALLOCATION PAUSED" : "SUBMIT REQUEST"}
                      </button>
                    ) : (
                      <Link
                        to="/login"
                        state={{ from: `/assets/${id}` }}
                        className="btn btn-primary btn-lg w-full rounded-2xl font-black text-xl shadow-xl shadow-primary/30"
                      >
                        LOG IN TO REQUEST
                      </Link>
                    )}
                  </div>
                  
                  <p className="text-xs text-center text-base-content/40 font-medium">
                    * Standard company policy applies to all {asset.productType.toLowerCase()} requests. 
                    Approval typically takes 2-4 business hours.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Related Items Section */}
        <section className="mt-24">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-4xl font-black text-base-content">Related Assets</h2>
              <div className="h-1.5 w-24 bg-primary mt-3 rounded-full"></div>
            </div>
            <Link to="/assets" className="btn btn-ghost font-bold text-primary">View All <FaArrowRight size={12} /></Link>
          </div>

          {relatedPending ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
               {[...Array(4)].map((_, i) => (
                 <div key={i} className="h-80 bg-base-100 rounded-3xl animate-pulse"></div>
               ))}
            </div>
          ) : related.length === 0 ? (
            <div className="bg-base-100 p-20 rounded-[3rem] text-center border-2 border-dashed border-base-300">
               <p className="text-xl opacity-40 font-bold italic">No complementary assets found in this segment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {related.map((item) => (
                <AssetCard 
                  key={item._id} 
                  asset={item} 
                  detailsLink={`/assets/${item._id}`}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AssetDetailsPublic;
