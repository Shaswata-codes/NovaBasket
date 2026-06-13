import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { setIsCartOpen, totalItemsCount } = useCart();

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-1.5 group">
              <span className="text-2xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent transform group-hover:scale-105 transition-transform duration-300">
                ⚡ SwiftStore
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden sm:flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors"
            >
              Shop
            </Link>
            <span className="text-gray-200">|</span>
            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Free Delivery
            </span>
          </div>

          {/* Cart Icon Section */}
          <div className="flex items-center">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-full transition-all duration-300 active:scale-95 group focus:outline-none cursor-pointer"
              aria-label="Shopping Cart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 transform group-hover:rotate-6 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>

              {/* Dynamic Badge */}
              {totalItemsCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-5 h-5 flex items-center justify-center px-1 bg-gradient-to-r from-rose-500 to-red-500 text-white text-[10px] font-extrabold rounded-full border-2 border-white shadow-sm animate-fade-in animate-bounce-subtle">
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
