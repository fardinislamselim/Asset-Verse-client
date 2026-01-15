import { FaArrowRight, FaBox, FaCalendarAlt, FaStar } from "react-icons/fa";
import { Link } from "react-router";

const AssetCard = ({ asset, detailsLink }) => {
  const {
    _id,
    productName,
    productImage,
    productType,
    availableQuantity,
    companyName,
    dateAdded,
    createdAt,
  } = asset;

  // Fallback values for missing fields as per user request
  const shortDescription = asset.shortDescription || `High-quality ${productType.toLowerCase()} asset from ${companyName}.`;
  const rating = asset.rating || (4 + Math.random()).toFixed(1);
  const displayDate = dateAdded || (createdAt ? new Date(createdAt).toLocaleDateString() : new Date().toLocaleDateString());

  return (
    <div className="group bg-base-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-base-200 flex flex-col h-full overflow-hidden">
      {/* Image Container */}
      <figure className="relative h-48 overflow-hidden">
        <img
          src={productImage}
          alt={productName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <div className={`badge ${productType === "Returnable" ? "badge-success" : "badge-secondary"} badge-sm font-semibold shadow-sm`}>
            {productType}
          </div>
          {availableQuantity <= 0 && (
             <div className="badge badge-error badge-sm font-semibold shadow-sm text-white">
                Out of Stock
             </div>
          )}
        </div>
        <div className="absolute bottom-3 left-3">
            <div className="badge badge-neutral bg-black/50 backdrop-blur-md border-none text-white badge-sm flex items-center gap-1">
                <FaBox className="text-[10px]" /> {availableQuantity} available
            </div>
        </div>
      </figure>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-base-content line-clamp-1 group-hover:text-primary transition-colors">
            {productName}
          </h3>
          <div className="flex items-center gap-1 text-warning font-semibold text-sm">
            <FaStar className="mb-0.5" />
            <span>{rating}</span>
          </div>
        </div>

        <p className="text-sm text-base-content/70 line-clamp-2 mb-4 flex-grow">
          {shortDescription}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-base-200">
          <div className="flex items-center gap-2 text-xs text-base-content/50">
            <FaCalendarAlt />
            <span>{displayDate}</span>
          </div>
          <span className="text-xs font-medium text-primary/70">{companyName}</span>
        </div>

        {/* Action */}
        <div className="mt-4">
          <Link
            to={detailsLink}
            className="btn btn-primary btn-sm w-full rounded-xl normal-case font-bold flex items-center justify-center gap-2 group/btn hover:gap-3 transition-all duration-300"
          >
            <span>View Details</span>
            <FaArrowRight className="text-[10px] transform group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export const AssetCardSkeleton = () => {
  return (
    <div className="bg-base-100 rounded-2xl border border-base-200 flex flex-col h-full overflow-hidden animate-pulse">
      <div className="h-48 bg-base-300"></div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div className="h-6 bg-base-300 rounded w-2/3"></div>
          <div className="h-4 bg-base-300 rounded w-10"></div>
        </div>
        <div className="space-y-2 mb-6">
          <div className="h-3 bg-base-300 rounded w-full"></div>
          <div className="h-3 bg-base-300 rounded w-5/6"></div>
        </div>
        <div className="flex justify-between mt-auto pt-4 border-t border-base-200">
          <div className="h-3 bg-base-300 rounded w-20"></div>
          <div className="h-3 bg-base-300 rounded w-16"></div>
        </div>
        <div className="mt-4 h-8 bg-base-300 rounded-xl w-full"></div>
      </div>
    </div>
  );
};

export default AssetCard;
