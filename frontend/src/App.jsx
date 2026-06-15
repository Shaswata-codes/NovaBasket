import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetails";
import Navbar from "./components/Navbar";
import CartDrawer from "./components/CartDrawer";
import { CartProvider } from "./context/CartContext";
import "./App.css";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order/:id" element={<OrderConfirmation />} />
            </Routes>
          </main>
          <CartDrawer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;