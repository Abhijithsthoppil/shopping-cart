import { useEffect, useState } from "react";
import { useCart } from "@context/CartContext";
import { ChevronDown, ChevronUp } from "lucide-react";
import AddFundsModal from "@components/Funds/AddFundsModal";
import { deductWallet, getWallet } from "@services/walletService";
import { useAuth } from "@context/AuthContext";
import { initiatePaytmPayment } from "@services/paytmService";
import { useNavigate } from "react-router-dom";


const Checkout = () => {
  const { cartItems } = useCart();
  const { user } = useAuth();
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const navigate = useNavigate();

  const [openSection, setOpenSection] = useState<"wallet" | "paytm" | "card" | "">("card");
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);

  const toggleSection = (section: "wallet" | "paytm" | "card") => {
    setOpenSection(prev => (prev === section ? "" : section));
  };

  useEffect(() => {
    const fetchWallet = async () => {
        if (!user) return;
      try {
        const wallet = await getWallet();
        setWalletBalance(wallet.balance);
      } catch (err) {
        console.error("Failed to fetch wallet balance", err);
      }
    };

    fetchWallet();
  }, [user]);

  const remainingAmount = Math.max(totalPrice - (walletBalance ?? 0), 0);
  const isWalletSufficient = (walletBalance ?? 0) >= totalPrice;


  const payWithPaytm = async () => {
    try {
      const data = await initiatePaytmPayment(totalPrice);
  
      const form = document.createElement("form");
      form.method = "post";
      form.action = `https://securegw-stage.paytm.in/theia/api/v1/showPaymentPage?mid=${data.body.mid}&orderId=${data.orderId}`;
  
      const input = (name: string, value: string) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        return input;
      };
  
      form.appendChild(input("mid", data.body.mid));
      form.appendChild(input("orderId", data.orderId));
      form.appendChild(input("txnToken", data.signature));
  
      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error("Paytm payment failed:", error);
    }
  };

  const handlePayWithWallet = async () => {
        await deductWallet(totalPrice);
        navigate("/checkout-success")
  }

  const handlePayWithCard = () => {
    navigate("/checkout-success")
  }
  

  return (
    <div className="max-w-3xl mx-auto p-6 font-sans">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Choose Payment Method</h2>

      {/* Wallet Section */}
      {user && (
        <div className="border border-gray-200 rounded-xl mb-4 overflow-hidden shadow">
            <button
            onClick={() => toggleSection("wallet")}
            className="w-full flex justify-between items-center px-5 py-4 bg-white hover:bg-gray-100 transition"
            >
            <span className="text-lg font-medium text-gray-800">💰 Pay with Wallet</span>
            {openSection === "wallet" ? <ChevronUp /> : <ChevronDown />}
            </button>
            {openSection === "wallet" && (
            <div className="px-5 pb-4 pt-2 bg-gray-50">
                <p className="text-gray-700 mb-2">
                Wallet Balance: <strong>₹{walletBalance?.toFixed(2)}</strong>
                </p>
                <p className="text-sm text-gray-500 mb-4">
                {isWalletSufficient
                    ? "Your wallet covers the full order amount."
                    : `Remaining to be paid: ₹${remainingAmount.toFixed(2)}`}
                </p>
                <div className="flex gap-4">
                <button
                    disabled={!isWalletSufficient}
                    className={`px-4 py-2 rounded-lg text-white font-semibold ${
                    isWalletSufficient
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                    onClick={handlePayWithWallet}
                >
                    Pay with Wallet
                </button>

                {!isWalletSufficient && (
                    <button
                        onClick={() => setShowAddFundsModal(true)}
                        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    >
                        Add ₹{remainingAmount.toFixed(2)} via Card
                    </button>
                )}
                </div>
            </div>
            )}
        </div>
        )}

      {/* Paytm Section */}
      <div className="border border-gray-200 rounded-xl mb-4 overflow-hidden shadow">
        <button
          onClick={() => toggleSection("paytm")}
          className="w-full flex justify-between items-center px-5 py-4 bg-white hover:bg-gray-100 transition"
        >
          <span className="text-lg font-medium text-gray-800">📱 Paytm</span>
          {openSection === "paytm" ? <ChevronUp /> : <ChevronDown />}
        </button>
        {openSection === "paytm" && (
          <div className="px-5 pb-4 pt-2 bg-gray-50">
            <p className="text-gray-700 mb-4">
              You'll be redirected to Paytm to complete the payment.
            </p>
            <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold" onClick={payWithPaytm}>
              Pay with Paytm
            </button>
          </div>
        )}
      </div>

      {/* Card Section */}
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow">
        <button
          onClick={() => toggleSection("card")}
          className="w-full flex justify-between items-center px-5 py-4 bg-white hover:bg-gray-100 transition"
        >
          <span className="text-lg font-medium text-gray-800">💳 Card Payment</span>
          {openSection === "card" ? <ChevronUp /> : <ChevronDown />}
        </button>
        {openSection === "card" && (
          <div className="px-5 pb-4 pt-2 bg-gray-50">
            <form className="space-y-4">
              <div>
                <label className="text-sm font-medium">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Name on Card</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Exp. Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">CVC</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="save" className="w-4 h-4" />
                <label htmlFor="save" className="text-sm">Save card for future payments</label>
              </div>
              <div className="text-center mt-6">
                <p className="text-lg font-medium text-gray-800 mb-1">Order Total:</p>
                <p className="text-2xl font-bold text-pink-600 mb-4">₹{totalPrice.toFixed(2)}</p>
                <button className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-6 rounded-full shadow-md" onClick={handlePayWithCard}>
                  Pay with Card
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      <AddFundsModal
        isOpen={showAddFundsModal}
        onClose={() => setShowAddFundsModal(false)}
        amount={remainingAmount}
        onSuccess={() => {
            getWallet().then(wallet => setWalletBalance(wallet.balance));
        }}
       />
    </div>
  );
};

export default Checkout;
