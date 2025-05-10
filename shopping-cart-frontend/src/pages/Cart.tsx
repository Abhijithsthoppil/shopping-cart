
import CartItemCard from "@components/Carts/CartItemCard";
import CartSummary from "@components/Carts/CartSummary";
import { useCart } from "@context/CartContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";



export default function Cart() {
  const { cartItems, shippingDetails, setShippingDetails } = useCart();
  const navigate = useNavigate();

  const [shippingErrors, setShippingErrors] = useState<{ [key: string]: string }>({});


  const handleContinueShopping = () => {
    navigate('/')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = () => {
    const errors: { [key: string]: string } = {};
    const requiredFields = [
      { name: "fullName", label: "Full Name" },
      { name: "phone", label: "Phone Number" },
      { name: "addressLine1", label: "Address Line 1" },
      { name: "city", label: "City" },
      { name: "state", label: "State" },
      { name: "pincode", label: "Pincode" },
    ];
  
    requiredFields.forEach(({ name, label }) => {
      if (!shippingDetails[name as keyof typeof shippingDetails]) {
        errors[name] = `${label} is required`;
      }
    });
  
    setShippingErrors(errors);
  
    if (Object.keys(errors).length === 0) {
      console.log("Order Placed!", shippingDetails);
      navigate('/checkout');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid gap-6 font-sans grid-cols-1 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <h2 className="text-lg font-bold text-gray-700">
          🛍️ {cartItems.length > 0 ? `${cartItems.length} ITEM${cartItems.length > 1 ? "S" : ""} SELECTED` : "Your Cart is Empty"}
        </h2>

        {cartItems.length > 0 ? (
          cartItems.map((item) => (
                <CartItemCard key={`${item.id}`} item={item} />
          ))
        ) : (
          <div className="text-center p-10 bg-white border border-gray-200 rounded-xl shadow">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
              alt="Empty Cart"
              className="mx-auto w-24 mb-4"
            />
            <p className="text-gray-600 text-lg font-semibold mb-4">Your cart is empty!</p>
            <button
              className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-6 rounded-full font-semibold shadow"
              onClick={() => handleContinueShopping()}
            >
              Continue Shopping
            </button>
          </div>
        )}
        {cartItems.length > 0 && <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 space-y-6">
                <h3 className="text-xl font-semibold text-gray-800">📦 Shipping Information</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                    { label: "Full Name", name: "fullName", type: "text", required: true },
                    { label: "Address Line 1", name: "addressLine1", type: "text", required: true },
                    { label: "Address Line 2 (Optional)", name: "addressLine2", type: "text", required: false },
                    { label: "City", name: "city", type: "text", required: true },
                    { label: "State", name: "state", type: "text", required: true },
                    { label: "Pincode", name: "pincode", type: "text", required: true },
                    { label: "Phone Number", name: "phone", type: "tel", required: true },
                    ].map(({ label, name, type, required }) => (
                    <div key={name} className="relative">
                        <input
                        type={type}
                        name={name}
                        required={required}
                        value={shippingDetails[name as keyof typeof shippingDetails]}
                        onChange={handleInputChange}
                        className={`peer w-full border rounded-xl px-4 pt-5 pb-2 text-sm placeholder-transparent focus:outline-none focus:ring-1 ${
                            shippingErrors[name] ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                        }`}
                        placeholder={label}
                        />
                        <label
                        htmlFor={name}
                        className="absolute left-4 top-2 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-pink-600"
                        >
                        {label}
                        </label>
                        {shippingErrors[name] && (
                        <p className="mt-1 text-xs text-red-500">{shippingErrors[name]}</p>
                        )}
                    </div>
                    ))}

                    </div>
                </div>
        }
      </div>

      {cartItems.length > 0 && (
        <div>
          <CartSummary items={cartItems} onPlaceOrder={handlePlaceOrder}/>
        </div>
      )}
    </div>
  );
}
