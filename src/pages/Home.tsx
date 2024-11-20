import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { useSearchStore } from '../lib/store';

const CATEGORIES = [
  "All",
  "Electronics",
  "Clothing",
  "Books",
  "Home & Garden",
  "Sports",
];

const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
    rating: 4.5,
    reviews: 128,
    category: "Electronics",
  },
  {
    id: "2",
    name: "Minimalist Watch",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800",
    rating: 4.8,
    reviews: 89,
    category: "Electronics",
  },
  {
    id: "3",
    name: "Cotton Casual T-Shirt",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800",
    rating: 4.2,
    reviews: 256,
    category: "Clothing",
  },
];

export function Home() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const { setQuery } = useSearchStore();
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [showFilters, setShowFilters] = React.useState(false);
  const [priceRange, setPriceRange] = React.useState([0, 1000]);

  // Update search store when URL param changes
  React.useEffect(() => {
    setQuery(searchQuery);
  }, [searchQuery, setQuery]);

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', selectedCategory, priceRange, searchQuery],
    queryFn: async () => {
      // In a real app, this would be an API call
      return MOCK_PRODUCTS.filter(
        (product) =>
          (selectedCategory === "All" || product.category === selectedCategory) &&
          product.price >= priceRange[0] &&
          product.price <= priceRange[1] &&
          (!searchQuery || product.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    },
  });

  return (
    <div className="flex gap-6">
      {/* Filters Sidebar */}
      <div className={`${showFilters ? 'block' : 'hidden'} md:block w-64 flex-shrink-0`}>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="font-semibold text-lg mb-4">Filters</h2>
          
          <div className="mb-6">
            <h3 className="font-medium mb-2">Categories</h3>
            <div className="space-y-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`block w-full text-left px-2 py-1 rounded ${
                    selectedCategory === category
                      ? "bg-blue-50 text-blue-600"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Price Range</h3>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {selectedCategory} Products
            {searchQuery && (
              <span className="text-lg font-normal text-gray-600 ml-2">
                Search results for "{searchQuery}"
              </span>
            )}
          </h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm"
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white rounded-lg shadow-md aspect-square animate-pulse"
              />
            ))}
          </div>
        ) : products?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No products found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products?.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}