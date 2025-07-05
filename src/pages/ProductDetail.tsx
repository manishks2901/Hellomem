// ProductDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star,
  ShoppingCart,
  ArrowLeft,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { motion } from "framer-motion";
import { useApp } from "../contexts/AppContext";
import { cartAPI } from "../services/api";
import ProductCard from "../components/common/ProductCard";
import toast from "react-hot-toast";

import Config from "../../config";
import { GET_PRODUCT_DETAIL, GET_RELATED_PRODUCTS_LIST, Product,color } from "../services/apiConfig";


const Feature = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="text-center">
    {icon}
    <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>
  </div>
);

// Utility to unescape the API HTML string
function decodeHtmlString(str: string, baseUrl: string): string {
  if (!str) return '';
  try {
    // Remove double escaping
    let decoded = str.replace(/\\r\\n/g, '\n').replace(/\\"/g, '"');
    decoded = decoded.replace(/\\(["'])/g, '$1');
    decoded = decoded.replace(/^"|"$/g, '');
    // Fix image src paths
    decoded = decoded.replace(/<img([^>]+)src=["'](\/[^"'>]+)["']/g, (match, pre, src) => {
      return `<img${pre}src="${baseUrl}${src}"`;
    });
    return decoded;
  } catch {
    return str;
  }
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [product, setProduct] = useState<Product>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const URL = Config.ADMIN_BASE_URL;
  const [color, setColor] = useState<color[]>([]);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const [productRes, relatedRes] = await Promise.all([
          GET_PRODUCT_DETAIL(id),
          GET_RELATED_PRODUCTS_LIST(id),
        ]);
        let parsedProduct: Product | undefined;
        const rawProduct = productRes;
        if (Array.isArray(rawProduct)) {
          parsedProduct = rawProduct[0];
        } else {
          parsedProduct = rawProduct;
        }
        setProduct(parsedProduct);
        setRelatedProducts(relatedRes);
        // Set color options from product
        const colors = parsedProduct?.ProductColorsJson;
        setColor(colors ?? []);
        // Set default selected color if available
        if (colors && colors.length > 0) {
          setSelectedColor(colors[0].ColorName || undefined);
        }
      } catch (error) {
        console.error("Error loading product data:", error);
        toast.error("Unable to load product");
        navigate("/products");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductAndRelated();
  }, [id, navigate, URL]);

  const handleAddToCart = async () => {
    if (!state.isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
    if (!product) return;
    if (color.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return;
    }
    try {
      await cartAPI.add(product.ProductId, quantity);
      const newCartItem = {
        id: Date.now(),
        productId: product.ProductId,
        name: product.ProductName,
        price: product.Price,
        image: images[0] || '',
        seller: product.VendorName || '',
        quantity,
        color: selectedColor,
      };
      dispatch({ type: "SET_CART", payload: [...state.cart, newCartItem] });
      toast.success(`Added ${quantity} item(s) to cart!`);
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  const handleBuyNow = () => {
    if (!state.isAuthenticated) {
      toast.error("Please login to continue");
      navigate("/login");
      return;
    }
    if (color.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return;
    }
    handleAddToCart();
    navigate("/cart");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Product not found
          </h2>
          <button
            onClick={() => navigate("/products")}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const images = product?.ProductImagesJson?.map((img) => `${URL}${img.AttachmentURL}`) || [];
  const safeSelectedImage = images[selectedImage] ? selectedImage : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Images */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-square bg-white dark:bg-gray-800 rounded-lg overflow-hidden"
            >
              {images.length > 0 ? (
                <img
                  src={images[safeSelectedImage]}
                  alt={product.ProductName || "Product image"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
              )}
            </motion.div>

            {images.length > 1 && (
              <div className="flex space-x-2">
                {images.map((image, index) => (
                  <button
                    key={index+1}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      safeSelectedImage === index
                        ? "border-blue-500"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.ProductName || "Product"} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {product.ProductName || "No Name"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">by {product.VendorName || "Unknown"}</p>

            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.Rating || 0)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600 dark:text-gray-400">
                {product.Rating || 0} ({product.TotalReviews || 0} reviews)
              </span>
            </div>

            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              ₹{product.Price?.toLocaleString() || "-"}
            </div>

            <div>
              {product.StockQuantity && product.StockQuantity > 0 ? (
                <span className="text-green-600 dark:text-green-400 font-medium">
                  ✓ In Stock ({product.StockQuantity} available)
                </span>
              ) : (
                <span className="text-red-600 dark:text-red-400 font-medium">
                  ✗ Out of Stock
                </span>
              )}
            </div>


            {/* Color Selection */}
            {color.length > 0 && (
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-gray-700 dark:text-gray-300">Color:</span>
                <div className="flex space-x-2">
                  {color.map((c, idx) => (
                    <button
                      key={
                        c.ColorName
                          ? `${c.ColorName}-${idx}`
                          : c.HexCode
                            ? `${c.HexCode}-${idx}`
                            : `color-${idx}`
                      }
                      type="button"
                      onClick={() => setSelectedColor(c.ColorName)}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center focus:outline-none transition-all ${
                        selectedColor === c.ColorName
                          ? 'border-blue-500 ring-2 ring-blue-300'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      title={c.ColorName}
                      style={c.HexCode ? { backgroundColor: c.HexCode } : {}}
                    >
                      
                    </button>
                  ))}
                </div>
                {selectedColor && (
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">{selectedColor}</span>
                )}
              </div>
            )}

            <div className="flex items-center space-x-4">
              <span className="text-gray-700 dark:text-gray-300">Quantity:</span>
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  -
                </button>
                <span className="px-4 py-2 border-x border-gray-300 dark:border-gray-600">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.StockQuantity || 1, quantity + 1))}
                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={!product.StockQuantity || product.StockQuantity === 0}
                className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Add to Cart</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBuyNow}
                disabled={!product.StockQuantity || product.StockQuantity === 0}
                className="flex-1 bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </motion.button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Feature icon={<Truck className="h-8 w-8 text-blue-500 mx-auto mb-2" />} text="Free Shipping" />
              <Feature icon={<Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />} text="Secure Payment" />
              <Feature icon={<RotateCcw className="h-8 w-8 text-purple-500 mx-auto mb-2" />} text="Easy Returns" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Product Description
          </h2>
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: decodeHtmlString(product.FullDescription || " ", URL) || "<p>No description.</p>" }}
          />
        </div>

        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.ProductId+1} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;