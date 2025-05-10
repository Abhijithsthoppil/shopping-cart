import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@pages/Home';
import Cart from '@pages/Cart';
import Checkout from '@pages/Checkout';
import Navbar from '@components/Navbar/Navbar';
import ProductDetails from '@pages/ProductDetails';
import MyOrders from '@pages/MyOrders';
import ProtectedRoute from '@components/Routes/ProtectedRoute';
import CheckoutSuccess from '@pages/CheckoutSuccess';

const App = () => {
  return (
    <Router>
      <div className="relative min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/product-details/:id" element={<ProductDetails />} />
          <Route path="/checkout-success" element={<CheckoutSuccess />} />
          <Route
            path="/my-orders"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
