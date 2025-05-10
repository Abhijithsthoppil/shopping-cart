import { CartItem } from "@context/CartContext";

interface CartSummaryProps {
    items: CartItem[];
    onPlaceOrder: () => void;
  }
  
export default function CartSummary({ items, onPlaceOrder }: CartSummaryProps) {
  const totalMrp = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const platformFee = 20;

  return (
    <div className="bg-white border border-gray-200 p-6 rounded-xl shadow">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Price Details ({items.length} items)</h3>
      <div className="space-y-2 text-sm text-gray-700">
        <div className="flex justify-between">
          <span>Total MRP</span>
          <span>₹{totalMrp}</span>
        </div>
        <div className="flex justify-between">
          <span>Discount on MRP</span>
          <span className="text-green-600">- ₹{totalMrp - totalPrice}</span>
        </div>
        <div className="flex justify-between">
          <span>Platform Fee</span>
          <span>₹{platformFee}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping Fee</span>
          <span className="text-green-600">FREE</span>
        </div>
      </div>
      <div className="flex justify-between mt-4 font-bold text-lg text-gray-800">
        <span>Total Amount</span>
        <span>₹{totalPrice + platformFee}</span>
      </div>
      <button className="mt-6 w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl font-semibold shadow" onClick={onPlaceOrder}>
        PLACE ORDER
      </button>
    </div>
  );
}
