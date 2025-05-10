import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "@context/CartContext";
import { getProductById } from "@services/productService";
import { ProductCard } from "@components/Products/ProductCard";


interface Product {
  id: number;
  name: string;
  image_url: string;
  price: number;
  category: string;
  brand: string;
  description: string;
}

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [related, setRelated] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      const fetched = await getProductById(parseInt(id));
      setProduct(fetched.product);
      setRelated(fetched.related);
    };
    fetchData();
  }, [id]);

  if (!product) return <div className="p-6 text-center text-gray-500">Loading product...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-8 font-sans">
      {/* Image */}
      <div className="rounded-xl shadow border overflow-hidden">
        <img src={product.image_url} alt={product.name} className="w-full object-cover h-96" />
      </div>

      {/* Info */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <div className="text-2xl font-bold text-pink-600 mb-4">₹{product.price}</div>

        {/* Quantity */}
        <div className="flex items-center mb-6">
          <label className="mr-3 font-medium text-gray-700">Quantity:</label>
          <select
            className="border rounded-md px-3 py-1 text-sm"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((q) => (
              <option key={q} value={q}>{q}</option>
            ))}
          </select>
        </div>

        <button
          className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-xl shadow"
          onClick={() => addToCart(product, quantity)}
        >
          Add to Cart
        </button>
      </div>

      {/* Related */}
      {related.length > 0 && <div className="md:col-span-2 mt-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Related Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {related.map((prod) => (
            <ProductCard key={prod.id} product={prod} onAddToCart={addToCart} />
          ))}
        </div>
      </div>}
    </div>
  );
}
