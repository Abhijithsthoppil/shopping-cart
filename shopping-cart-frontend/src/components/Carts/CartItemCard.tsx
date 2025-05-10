import { CartItem, useCart } from "@context/CartContext";

export default function CartItemCard({ item }: { item: CartItem }) {
  const { removeFromCart, updateItem } = useCart();

  return (
    <div className="flex gap-4 bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <img
        src={item.image_url}
        alt={item.name}
        className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover border border-gray-200"
      />

      <div className="flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">{item.name}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{item.brand} • {item.category}</p>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600">Qty:</label>
            <select
              value={item.quantity}
              onChange={(e) =>
                updateItem(item.id, { quantity: parseInt(e.target.value) })
              }
              className="rounded-lg border border-gray-300 px-3 py-1 text-sm focus:ring-pink-500 focus:border-pink-500"
            >
              {[1, 2, 3, 4, 5].map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </div>

          <div className="text-pink-600 font-bold text-lg">
            ₹{(item.price * item.quantity).toFixed(2)}
          </div>
        </div>

        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-400">🔄 14 days return available</span>
          <button
            onClick={() => removeFromCart(item.id)}
            className="text-sm text-red-500 hover:text-red-600 underline transition"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
