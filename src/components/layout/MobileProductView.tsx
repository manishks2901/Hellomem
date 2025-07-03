import React, { useEffect, useState } from "react";
import { Heart, Star, X } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import { GET_ALL_PRODUCTS, Product } from "../../services/apiConfig";
import Config from "../../../config";

const genderOptions = [
  {
    label: "Women",
    img: "https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Men",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Girls",
    img: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Boys",
    img: "https://images.unsplash.com/photo-1550525811-e5869dd03032?auto=format&fit=crop&w=800&q=80",
  },
];

const MobileProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showBar, setShowBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  useEffect(() => {
    GET_ALL_PRODUCTS().then((productsRes) => {
      setProducts(productsRes);
    });
  }, []);

  return (
    <div className="bg-white min-h-screen px-3 pb-24">
      {/* Sticky Filter Bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 py-2 px-2">
        <div className="grid grid-cols-4 gap-[1px] bg-gray-200 text-xs">
          {["Sort", "Category", "Gender", "Filters"].map((label) => (
            <button
              key={label}
              onClick={() => setShowGenderModal(true)} // adjust individually if needed
              className="flex items-center justify-center gap-1 rounded-none bg-white text-gray-900 font-semibold text-sm py-2.5"
            >
              {label === "Sort" && <span className="text-lg">⇅</span>}
              {label === "Filters" && <span className="text-lg">☰</span>}
              <span>{label}</span>
              {(label === "Category" || label === "Gender") && (
                <svg
                  className="w-3 h-3 ml-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-3">
        {products.map((product: Product) => (
          <div
            key={product.ProductId}
            className="relative border rounded-lg overflow-hidden bg-white shadow-sm"
          >
            <img
              src={`${Config.ADMIN_BASE_URL}${product.ProductImagesJson[0].AttachmentURL}`}
              alt={product.ProductImagesJson[0].AttachmentName}
              className="w-full h-36 object-cover"
            />
            <button
              className="absolute top-2 right-2 text-gray-500"
              title="Add to wishlist"
              aria-label="Add to wishlist"
            >
              <Heart className="w-4 h-4" />
            </button>
            <div className="p-2 text-xs space-y-1">
              <p className="font-medium truncate leading-tight">
                {product.ProductName}
              </p>
              <p className="text-gray-900 font-semibold text-sm">
                ₹{product.DiscountedPrice || product.Price}
              </p>
              {product.Price && (
                <p className="text-gray-400 line-through text-xs">
                  ₹{product.Price}
                </p>
              )}
              <div className="flex items-center gap-1 text-green-600 text-xs">
                <Star className="w-3 h-3" />{" "}
                {product.Rating?.toFixed(1) || "4.0"}
              </div>
              <p className="text-gray-500 text-[11px]">Free Delivery</p>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showGenderModal && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 z-40"
          >
            <div className="bg-white rounded-t-2xl p-4 shadow-lg border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-semibold text-gray-700">GENDER</h2>
                <button
                  onClick={() => setShowGenderModal(false)}
                  title="Close gender modal"
                  aria-label="Close gender modal"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-3 mb-4">
                {genderOptions.map((option) => (
                  <div
                    key={option.label}
                    className="flex flex-col items-center text-xs"
                  >
                    <img
                      src={option.img}
                      alt={option.label}
                      className="w-12 h-12 rounded-full object-cover border"
                    />
                    <span className="mt-1">{option.label}</span>
                  </div>
                ))}
              </div>
              <button
                className="w-full py-2 bg-[#9c27b0] text-white rounded text-sm font-medium"
                onClick={() => setShowGenderModal(false)}
              >
                Done
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileProductList;
