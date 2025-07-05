import React, { useState, useEffect } from 'react';
import { Home, ShoppingBag, User, Shirt, Baby, Heart } from 'lucide-react';
import { POPULAR_CATEGORY, PopularCategory, GET_ALL_PRODUCTS, Product } from '../../services/apiConfig';
import Config from '../../../config';

export default function SidebarWithCategoryPanel() {
  const [categories, setCategories] = useState<PopularCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<PopularCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryProducts, setCategoryProducts] = useState<Record<number, Product[]>>({});

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const cats = await POPULAR_CATEGORY();
        setCategories(cats);
        setSelectedCategory(cats[0] || null);
      } catch {
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await GET_ALL_PRODUCTS();
        setProducts(allProducts);
        // Precompute products for each category for quick access
        const byCategory: Record<number, Product[]> = {};
        categories.forEach(cat => {
          byCategory[cat.CategoryID] = allProducts.filter(p => p.CategoryID === cat.CategoryID).slice(0, 4);
        });
        setCategoryProducts(byCategory);
      } catch {
        setProducts([]);
      }
    };
    if (categories.length > 0) fetchProducts();
  }, [categories]);

  const iconMap: Record<string, JSX.Element> = {
    'Women Ethnic': <ShoppingBag />, 'Women Western': <Shirt />, 'Men': <User />, 'Kids': <Baby />, 'Home & Kitchen': <Home />, 'Beauty & Health': <Heart />,
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-24 bg-gray-100 border-r flex flex-col items-center py-4 space-y-4">
        {loading ? (
          <div className="text-xs text-gray-400">Loading...</div>
        ) : (
          categories.map((cat: PopularCategory) => (
            <button
              key={cat.CategoryID}
              onClick={() => setSelectedCategory(cat)}
              className={`flex flex-col items-center text-xs p-2 rounded-md w-full ${
                selectedCategory?.CategoryID === cat.CategoryID ? 'bg-white text-purple-600 font-semibold shadow' : 'text-gray-600'
              }`}
            >
              <div className="w-10 h-10 flex items-center justify-center mb-1 overflow-hidden rounded-full bg-white border">
                {cat.AttachmentURL ? (
                  <img
                    src={`${Config.ADMIN_BASE_URL}${cat.AttachmentURL}`}
                    alt={cat.Name}
                    className="object-cover w-10 h-10"
                  />
                ) : (
                  iconMap[cat.Name] || <ShoppingBag />
                )}
              </div>
              <span className="text-center truncate w-full">{cat.Name.split(' ')[0]}</span>
            </button>
          ))
        )}
      </aside>

      {/* Right Panel */}
      <main className="flex-1 overflow-y-auto p-6">
        {selectedCategory ? (
          <div>

           


            {/* Render 3-4 products for this category */}
            <div className="mt-6">
              <h3 className="text-md font-semibold text-gray-700 mb-2">Products</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(categoryProducts[selectedCategory.CategoryID] || []).slice(0, 4).map(product => (
                  <div key={product.ProductId} className="border rounded-lg p-2 bg-white shadow-sm flex flex-col items-center">
                    <img
                      src={product.ProductImagesJson && product.ProductImagesJson[0] ? `${Config.ADMIN_BASE_URL}${product.ProductImagesJson[0].AttachmentURL}` : '/no-image.png'}
                      alt={product.ProductName}
                      className="w-20 h-20 object-cover rounded mb-2"
                    />
                    <div className="text-xs font-medium text-gray-800 text-center truncate w-full">{product.ProductName}</div>
                    <div className="text-xs text-gray-500">₹{product.Price}</div>
                  </div>
                ))}
                {(categoryProducts[selectedCategory.CategoryID] || []).length === 0 && (
                  <div className="text-xs text-gray-400 col-span-2">No products found for this category.</div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-400">Select a category</div>
        )}
      </main>
    </div>
  );
}
