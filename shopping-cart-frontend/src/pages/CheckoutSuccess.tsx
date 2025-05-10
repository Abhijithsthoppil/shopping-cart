import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { placeOrder } from "@services/orderService";
import { useAuth } from "@context/AuthContext";
import { useCart } from "@context/CartContext";
import { CheckCircle2 } from "lucide-react";

export interface OrderItem {
    product_id: number;
    name: string;
    price: number;
    qty: number;
  }
  
  export interface ShippingInfo {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postalCode: string;
    country: string;
  }
  
  export interface OrderPayload {
    items: OrderItem[];
    shipping: ShippingInfo;
    total_price: number;
  }
  

const CheckoutSuccess: React.FC = () => {
  const { user } = useAuth();
  const { clearCart,  shippingDetails, cartItems } = useCart();
  const navigate = useNavigate();
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");

  useEffect(() => {
    const handleOrderPlacement = async () => {
        if(!user) return;
      try {
        const orderPayload: OrderPayload= {
            items: cartItems.map(item => ({
              product_id: item.id,
              name: item.name,
              price: item.price,
              qty: item.quantity
            })),
            shipping: {
              fullName: shippingDetails.fullName,
              addressLine1: shippingDetails.addressLine1,
              addressLine2: shippingDetails.addressLine2,
              city: shippingDetails.city,
              postalCode: shippingDetails.pincode,
              country: "India"
            },
            total_price: totalPrice
        };
          

        await placeOrder(orderPayload);
        clearCart();
        setStatus("success");
      } catch (error) {
        console.error("Order placement failed:", error);
        setStatus("error");
      }
    };

    handleOrderPlacement();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md text-center space-y-6 bg-white p-8 rounded-xl shadow-md">
        {status === "processing" && (
          <>
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500 mx-auto" />
            <p className="text-gray-600 text-lg">Placing your order...</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="text-green-600 w-16 h-16 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-800">Order Placed!</h2>
            <p className="text-gray-600">Thank you for shopping with us.</p>
            {user && (
              <button
                onClick={() => navigate("/my-orders")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                View My Orders
              </button>
            )}
          </>
        )}

        {status === "error" && (
          <p className="text-red-500 text-lg">Failed to place the order. Please try again.</p>
        )}
      </div>
    </div>
  );
};

export default CheckoutSuccess;
