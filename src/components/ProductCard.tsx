import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useCartStore, useWishlistStore } from '../lib/store';
import { cn } from '../lib/utils';

type ProductCardProps = {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
};

export function ProductCard({ id, name, price, image, rating, reviews }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore();
  const isWishlisted = wishlistItems.includes(id);

  return (
    <div className="group relative bg-white rounded-lg shadow-md overflow-hidden">
      <Link to={`/product/${id}`}>
        <div className="aspect-square overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      </Link>
      
      <button
        onClick={() => isWishlisted ? removeFromWishlist(id) : addToWishlist(id)}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm"
      >
        <Heart
          className={cn(
            "w-5 h-5",
            isWishlisted ? "fill-red-500 stroke-red-500" : "stroke-gray-600"
          )}
        />
      </button>

      <div className="p-4">
        <Link to={`/product/${id}`}>
          <h3 className="font-medium text-gray-900 mb-2 hover:text-blue-600">
            {name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-4 h-4",
                i < rating ? "fill-yellow-400 stroke-yellow-400" : "stroke-gray-300"
              )}
            />
          ))}
          <span className="text-sm text-gray-500">({reviews})</span>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-gray-900">
            ${price.toFixed(2)}
          </p>
          <button
            onClick={() => addItem({ id, name, price, image, quantity: 1 })}
            className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}