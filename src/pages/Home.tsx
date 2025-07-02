import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../contexts/AppContext";
import { productsAPI, categoriesAPI } from "../services/api";
import ProductCard from "../components/common/ProductCard";
import axios from "axios";
import Config from "../../config";
import Products from "./Products";
const Home: React.FC = () => {
  const { state, dispatch } = useApp();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [popularProducts, setPopularProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [popularCategories, setPopularCategories] = useState([]);
  const [ banner,setBanner ] = useState([])
  const [ fetchData,setFetchData] = useState([])
  useEffect(() => {
  const fetchBanners = async () => {
    try {
      const response = await axios.post(
        `${Config.ADMIN_BASE_URL}${Config.DYNAMIC_METHOD_SUB_URL}${Config.END_POINT_NAMES.GET_HOME_SCREEN_BANNER}`,
        {
          requestParameters: {
            recordValueJson: "[]"
          }
        }
      );

      // If the response is a JSON string, parse it
      const parsed = response.data
      setFetchData(JSON.parse(parsed.data))
      
      // TODO: setBanners(parsed); // ← If you’re storing in state
    } catch (error) {
      console.error('Error fetching or parsing banners:', error);
    }
  };

  fetchBanners();

  const BannerData = fetchData.slice(-3);
  setBanner(BannerData)
  console.log("Banner data",BannerData)

}, []);
  const banners = [
    {
      id: "1",
      title: "Summer Sale",
      subtitle: "Up to 70% Off",
      description: "Biggest sale of the year on fashion and electronics",
      image:
        "https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=1200",
      cta: "Shop Now",
    },
    {
      id: "2",
      title: "New Arrivals",
      subtitle: "Fresh Collection",
      description: "Discover the latest trends in fashion and lifestyle",
      image:
        "https://images.pexels.com/photos/914668/pexels-photo-914668.jpeg?auto=compress&cs=tinysrgb&w=1200",
      cta: "Explore",
    },
    {
      id: "3",
      title: "Electronics Deals",
      subtitle: "Tech at Best Prices",
      description: "Latest gadgets and electronics at unbeatable prices",
      image:
        "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=1200",
      cta: "Shop Electronics",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });

        const [popularRes, recentRes, categoriesRes] = await Promise.all([
          productsAPI.getPopular(),
          productsAPI.getRecent(),
          categoriesAPI.getPopular(),
        ]);

        setPopularProducts(popularRes.data);
        setRecentProducts(recentRes.data);
        setPopularCategories(categoriesRes.data);
      } catch (error) {
        console.error("Failed to fetch home data:", error);
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    fetchData();
  }, [dispatch]);

  // Auto-rotate banners
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
       <section className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Popular Categories
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Explore our most popular categories and find exactly what you're
              looking for
            </p>
          </div>

          <div className="flex gap-6 justify-center overflow-x-auto pb-2">
            {popularCategories.map((category: any, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="flex flex-col items-center min-w-[90px]"
              >
                <Link
                  to={`/products?categoryId=${category.id}`}
                  className="flex flex-col items-center group"
                >
                  <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-gray-200 dark:border-gray-600 group-hover:border-blue-500 transition-all">
                    {category.imageUrl ? (
                      <img
                        src={category.imageUrl}
                        alt={category.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-3xl">{category.icon}</span>
                    )}
                  </div>
                  <span className="mt-2 text-sm font-medium text-gray-900 dark:text-white max-w-[80px] truncate block text-center">
                    {category.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section> 
      {/* Hero Section */}
      <section className="relative h-96 md:h-[500px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBanner}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${banners[currentBanner].image})`,
              }}
            >
              <div className="absolute inset-0 bg-black/40" />
              <div className="relative h-full flex items-center justify-center text-center text-white px-4">
                <div className="max-w-3xl">
                  <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl md:text-6xl font-bold mb-4"
                  >
                    {banners[currentBanner].title}
                  </motion.h1>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl md:text-2xl mb-2"
                  >
                    {banners[currentBanner].subtitle}
                  </motion.p>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-lg mb-8"
                  >
                    {banners[currentBanner].description}
                  </motion.p>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <Link
                      to="/products"
                      className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors inline-flex items-center space-x-2"
                    >
                      <span>{banners[currentBanner].cta}</span>
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Banner Navigation */}
        <button
          onClick={prevBanner}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextBanner}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Banner Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentBanner ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Popular Categories Section */}
      

      {/* Popular Products */}
      {/* <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Popular Products
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Most loved products by our customers
              </p>
            </div>
            <Link
              to="/products"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {popularProducts.map((product: any, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section> */}
      <Products/>
      {/* New Arrivals */}
      
      {recentProducts.length > 0 && (
        <section className="py-12 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  New Arrivals
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Fresh products just added to our collection
                </p>
              </div>
              <Link
                to="/products?new=true"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center space-x-1"
              >
                <span>View All</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentProducts.map((product: any, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-blue-500 to-teal-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Stay Updated with Our Latest Deals
            </h2>
            <p className="text-white/90 text-lg mb-8">
              Subscribe to our newsletter and never miss out on amazing offers
              and new arrivals
            </p>
            <div className="max-w-md mx-auto flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-l-lg border-0 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-500"
              />
              <button className="bg-white text-blue-600 px-6 py-3 rounded-r-lg font-semibold hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;


