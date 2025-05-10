import { addToWallet } from "@services/walletService";
import React, { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onSuccess?: () => void;
}

const AddFundsModal: React.FC<Props> = ({ isOpen, onClose, amount, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  if (!isOpen) return null;

  const handleAddFunds = async () => {
    try {
      setLoading(true);
      setError("");
      await addToWallet(amount);
      onSuccess?.(); 
      onClose(); 
    } catch (err) {
      setError("Failed to add funds");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-bold mb-4 text-gray-800">Add ₹{amount.toFixed(2)} via Card</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}

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
              <label className="text-sm font-medium">Expiry</label>
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
        </form>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleAddFunds}
            className="px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 text-white font-semibold"
          >
           {loading ? "Processing..." : `Add ₹${amount.toFixed(2)} via Card`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFundsModal;
