import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '../../contexts/AppContext';
import { useApp } from '../../contexts/AppContext';
import { cartAPI } from '../../services/api';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const { state, dispatch } = useApp();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!state.isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      await cartAPI.add(product.id, 1);
      
      // Update local cart state
      const newCartItem = {
        id: Date.now(),
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        seller: product.seller
      };
      
      dispatch({ type: 'SET_CART', payload: [...state.cart, newCartItem] });
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Link to={`/products/${product.id}`}>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
          {/* Image Container */}
          <div className="relative overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col space-y-1">
              {product.isNew && (
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  New
                </span>
              )}
              {product.discount && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  -{product.discount}%
                </span>
              )}
            </div>

            {/* Quick Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="absolute bottom-2 right-2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-200"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="mb-2">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {product.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                by {product.seller}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-1 mb-2">
              <div className="flex items-center">
                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">
                  {product.rating}
                </span>
              </div>
              <span className="text-xs text-gray-400">
                ({product.reviews})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="mt-2">
              {product.stock > 0 ? (
                <span className="text-xs text-green-600 dark:text-green-400">
                  {product.stock} in stock
                </span>
              ) : (
                <span className="text-xs text-red-600 dark:text-red-400">
                  Out of stock
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;