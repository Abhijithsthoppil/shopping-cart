import { ShoppingCart, User, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@context/AuthContext";
import LoginModal from "@components/Modal/LoginModal";
import SignUpModal from "@components/Modal/SignUpModal";
import { useCart } from "@context/CartContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if(search.length === 0) {
        navigate('/');
    }
    if (search.trim()) {
      navigate(`/?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <>
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-green-700">
            🛒 ShopNow
          </Link>

          {/* Search Bar */}
          <div className="flex-1 mx-6 max-w-lg hidden md:block">
            <form className="relative" onSubmit={handleSearch}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex items-center text-gray-600 hover:text-green-600 transition"
            >
              <ShoppingCart size={22} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* Auth / Profile */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="flex items-center gap-1 text-gray-700 hover:text-green-600 transition"
                >
                  <User size={22} />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg text-sm z-50">
                    <Link
                      to="/my-orders"
                      className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowLogin(true)}
                  className="text-sm px-3 py-1.5 rounded border border-green-500 text-green-600 hover:bg-green-50 transition"
                >
                  Login
                </button>
                <button
                  onClick={() => setShowSignup(true)}
                  className="text-sm px-3 py-1.5 rounded bg-green-500 text-white hover:bg-green-600 transition"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modals */}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <SignUpModal isOpen={showSignup} onClose={() => setShowSignup(false)} />
    </>
  );
};

export default Navbar;
