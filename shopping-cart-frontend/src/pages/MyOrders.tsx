import { useEffect, useState } from "react";
import { getOrdersByUser } from "@services/orderService";

interface OrderItem {
  product_id: number;
  name: string;
  price: number;
  qty: number;
}

interface Order {
  order_id: string;
  created_at: string;
  items: OrderItem[];
  total_price: number;
  shipping: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
}

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrdersByUser();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500 animate-pulse">
        Loading your orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        You haven't placed any orders yet.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">📦 My Orders</h1>

      <div className="space-y-8">
        {orders.map((order) => (
          <div
            key={order.order_id}
            className="bg-white rounded-2xl shadow-md border border-gray-200 p-6"
          >
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium text-gray-800">Order ID:</span>{" "}
                {order.order_id}
              </div>
              <div className="text-sm text-gray-500 mt-2 md:mt-0">
                {new Date(order.created_at).toLocaleString()}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-2">
                  🛍️ Items
                </h2>
                <ul className="space-y-2 divide-y divide-gray-100">
                  {order.items.map((item, index) => (
                    <li
                      key={index}
                      className="py-2 flex justify-between text-sm text-gray-700"
                    >
                      <span>
                        {item.name} <span className="text-gray-500">x {item.qty}</span>
                      </span>
                      <span className="font-medium">
                        ₹ {(item.price * item.qty).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-2">
                  🚚 Shipping Info
                </h2>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>{order.shipping.fullName}</p>
                  <p>{order.shipping.addressLine1}</p>
                  {order.shipping.addressLine2 && <p>{order.shipping.addressLine2}</p>}
                  <p>
                    {order.shipping.city}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 text-right text-base font-semibold text-gray-800">
              🧾 Total Paid: ₹ {order.total_price.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
