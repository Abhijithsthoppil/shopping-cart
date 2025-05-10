import React from "react";
import { Link } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  image_url: string;
  price: number;
  category: string;
  brand: string;
  description: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
      <Link to={`/product-details/${product.id}`} className="group">
        <div className="overflow-hidden rounded-t-2xl">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="p-4 space-y-2">
          <h3 className="text-base font-semibold text-gray-800 truncate">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
          <div className="text-lg font-bold text-pink-600">₹{product.price}</div>
        </div>
      </Link>

      <div className="px-4 pb-4 pt-2">
        <button
          onClick={() => onAddToCart(product)}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold py-2 rounded-xl transition-colors duration-200"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};
