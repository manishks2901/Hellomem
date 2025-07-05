
import React, { useEffect, useState, useMemo } from "react";
import { Heart, Star, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GET_ALL_PRODUCTS, GET_CATEGORY_LIST, Product, Category } from "../../services/apiConfig";
import Config from "../../../config";
import { Link } from "react-router-dom";

const genderOptions = [
  { label: "Women", img: "https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?auto=format&fit=crop&w=800&q=80" },
  { label: "Men", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80" },
  { label: "Girls", img: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=800&q=80" },
  { label: "Boys", img: "https://images.unsplash.com/photo-1550525811-e5869dd03032?auto=format&fit=crop&w=800&q=80" },
];


const genderMap: Record<string, string[]> = {
  Women: ["Women", "Female", "Ladies", "Girl"],
  Men: ["Men", "Male", "Gentlemen", "Boy"],
  Girls: ["Girls", "Girl"],
  Boys: ["Boys", "Boy"],
};

const MobileProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<number | null>(null);
  const [currentGender, setCurrentGender] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("popularity");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [rating, setRating] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    Promise.all([GET_ALL_PRODUCTS(), GET_CATEGORY_LIST()]).then(
      ([productsRes, categoriesRes]) => {
        setProducts(productsRes);
        setCategories(categoriesRes);
      }
    );
  }, []);

  // Filtering logic (ref: Products.tsx)
  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) => p.ProductName?.toLowerCase().includes(q)
      );
    }


    // Category filtering (if Product has CategoryID)
    if (currentCategory !== null) {
      filtered = filtered.filter((p) => p.CategoryID === currentCategory);
    }

    filtered = filtered.filter(
      (p) => p.Price >= priceRange[0] && p.Price <= priceRange[1]
    );

    if (rating > 0) {
      filtered = filtered.filter((p) => p.Rating >= rating);
    }

    if (currentGender) {
      const genderKeywords = genderMap[currentGender] || [currentGender];
      filtered = filtered.filter((p) => {
        const name = p.ProductName?.toLowerCase() || "";
        return genderKeywords.some((g) => name.includes(g.toLowerCase()));
      });
    }

    switch (sortBy) {
      case "price-low":
        filtered = [...filtered].sort((a, b) => a.Price - b.Price);
        break;
      case "price-high":
        filtered = [...filtered].sort((a, b) => b.Price - a.Price);
        break;
      case "rating":
        filtered = [...filtered].sort((a, b) => b.Rating - a.Rating);
        break;
      // 'newest' sorting is skipped because Product does not have CreatedOn
      default:
        break;
    }

    return filtered;
  }, [products, searchQuery, priceRange, rating, currentGender, sortBy, currentCategory]);

  return (
    <div className="bg-white min-h-screen px-3 pb-24">
      {/* Sticky Filter Bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 py-2 px-2">
        <div className="grid grid-cols-4 gap-[1px] bg-gray-200 text-xs">
          <button
            onClick={() => setShowSortModal(true)}
            className="flex items-center justify-center gap-1 rounded-none bg-white text-gray-900 font-semibold text-sm py-2.5"
          >
            <span className="text-lg">⇅</span>
            <span>Sort</span>
          </button>
          <button
            onClick={() => setShowCategoryModal(true)}
            className="flex items-center justify-center gap-1 rounded-none bg-white text-gray-900 font-semibold text-sm py-2.5"
          >
            <span>Category</span>
            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>
          <button
            onClick={() => setShowGenderModal(true)}
            className="flex items-center justify-center gap-1 rounded-none bg-white text-gray-900 font-semibold text-sm py-2.5"
          >
            <span>Gender</span>
            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>
          <button
            onClick={() => setShowFilterModal(true)}
            className="flex items-center justify-center gap-1 rounded-none bg-white text-gray-900 font-semibold text-sm py-2.5"
          >
            <span className="text-lg">☰</span>
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Filtered Product Grid */}
      <div className="grid grid-cols-2 gap-3 mt-3">
        {filteredProducts.map((product: Product) => (
          <Link key={product.ProductId} to={`/products/${product.ProductId}`}>
            <div className="relative border rounded-lg overflow-hidden bg-white shadow-sm">
              <img
                src={`${Config.ADMIN_BASE_URL}${product.ProductImagesJson[0]?.AttachmentURL}`}
                alt={product.ProductImagesJson[0]?.AttachmentName}
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
                <p className="font-medium truncate leading-tight">{product.ProductName}</p>
                <p className="text-gray-900 font-semibold text-sm">₹{product.Price}</p>
                <div className="flex items-center gap-1 text-green-600 text-xs">
                  <Star className="w-3 h-3" /> {product.Rating?.toFixed(1) || "4.0"}
                </div>
                <p className="text-gray-500 text-[11px]">Free Delivery</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Modals for Filters, Category, Gender, Sort */}
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
                <button onClick={() => setShowGenderModal(false)} title="Close gender modal" aria-label="Close gender modal">
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-3 mb-4">
                {genderOptions.map((option) => (
                  <button
                    key={option.label}
                    className={`flex flex-col items-center text-xs ${currentGender === option.label ? "border-2 border-[#9c27b0]" : ""}`}
                    onClick={() => setCurrentGender(option.label)}
                  >
                    <img src={option.img} alt={option.label} className="w-12 h-12 rounded-full object-cover border" />
                    <span className="mt-1">{option.label}</span>
                  </button>
                ))}
              </div>
              <button className="w-full py-2 bg-[#9c27b0] text-white rounded text-sm font-medium" onClick={() => setShowGenderModal(false)}>
                Done
              </button>
            </div>
          </motion.div>
        )}
        {showCategoryModal && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 z-40"
          >
            <div className="bg-white rounded-t-2xl p-4 shadow-lg border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-semibold text-gray-700">CATEGORIES</h2>
                <button onClick={() => setShowCategoryModal(false)} title="Close category modal" aria-label="Close category modal">
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                <button
                  className={`block w-full text-left px-3 py-2 rounded ${currentCategory === null ? "bg-[#9c27b0] text-white" : ""}`}
                  onClick={() => setCurrentCategory(null)}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.CategoryID}
                    className={`block w-full text-left px-3 py-2 rounded ${currentCategory === cat.CategoryID ? "bg-[#9c27b0] text-white" : ""}`}
                    onClick={() => setCurrentCategory(cat.CategoryID)}
                  >
                    {cat.Name}
                  </button>
                ))}
              </div>
              <button className="w-full py-2 mt-4 bg-[#9c27b0] text-white rounded text-sm font-medium" onClick={() => setShowCategoryModal(false)}>
                Done
              </button>
            </div>
          </motion.div>
        )}
        {showSortModal && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 z-40"
          >
            <div className="bg-white rounded-t-2xl p-4 shadow-lg border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-semibold text-gray-700">SORT BY</h2>
                <button onClick={() => setShowSortModal(false)} title="Close sort modal" aria-label="Close sort modal">
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <div className="space-y-2">
                {[
                  { value: "popularity", label: "Sort by Popularity" },
                  { value: "price-low", label: "Price: Low to High" },
                  { value: "price-high", label: "Price: High to Low" },
                  { value: "rating", label: "Highest Rated" },
                  { value: "newest", label: "Newest First" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    className={`block w-full text-left px-3 py-2 rounded ${sortBy === opt.value ? "bg-[#9c27b0] text-white" : ""}`}
                    onClick={() => setSortBy(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <button className="w-full py-2 mt-4 bg-[#9c27b0] text-white rounded text-sm font-medium" onClick={() => setShowSortModal(false)}>
                Done
              </button>
            </div>
          </motion.div>
        )}
        {showFilterModal && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 z-40"
          >
            <div className="bg-white rounded-t-2xl p-4 shadow-lg border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-semibold text-gray-700">FILTERS</h2>
                <button onClick={() => setShowFilterModal(false)} title="Close filter modal" aria-label="Close filter modal">
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              {/* Price Range */}
              <div className="mb-4">
                <h3 className="text-xs font-medium text-gray-900 mb-2">Price Range</h3>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer"
                  title="Select maximum price"
                />
                <div className="flex justify-between text-xs text-gray-600">
                  <span>₹0</span>
                  <span>₹{priceRange[1].toLocaleString()}</span>
                </div>
              </div>
              {/* Rating Filter */}
              <div className="mb-4">
                <h3 className="text-xs font-medium text-gray-900 mb-2">Minimum Rating</h3>
                <div className="flex gap-2">
                  {[0, 1, 2, 3, 4].map((r) => (
                    <button
                      key={r}
                      className={`px-2 py-1 rounded ${rating === r ? "bg-[#9c27b0] text-white" : "bg-gray-100"}`}
                      onClick={() => setRating(r)}
                    >
                      {r === 0 ? "All" : `${r}+`}
                    </button>
                  ))}
                </div>
              </div>
              {/* Search Query */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border rounded px-3 py-2 text-xs"
                />
              </div>
              <button className="w-full py-2 bg-[#9c27b0] text-white rounded text-sm font-medium" onClick={() => setShowFilterModal(false)}>
                Apply Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileProductList;
