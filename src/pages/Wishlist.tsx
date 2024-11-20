import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProductCard } from '../components/ProductCard';
import { useWishlistStore } from '../lib/store';
import { Product } from '../types/product';

// Share the same mock data across components
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

export function Wishlist() {
  const { items } = useWishlistStore();

  const { data: products, isLoading } = useQuery({
    queryKey: ['wishlist-products', items],
    queryFn: async () => {
      return MOCK_PRODUCTS.filter(product => items.includes(product.id));
    },
  });

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">Your wishlist is empty</h2>
        <p className="text-gray-600">Add items to your wishlist to save them for later</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">My Wishlist</h1>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white rounded-lg shadow-md aspect-square animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products?.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      )}
    </div>
  );
}