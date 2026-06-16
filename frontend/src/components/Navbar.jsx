import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { clearToken, getAccessToken } from "../utils/auth";

function Navbar() {
  const { setIsCartOpen, totalItemsCount, fetchCart } = useCart();
  const navigate = useNavigate();

  const isLoggedIn = () => {
    return !!getAccessToken();
  };

  const logout = async () => {
    clearToken();
    await fetchCart();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-black bg-linear-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent"
          >
            ⚡ SwiftStore
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-semibold text-gray-600 hover:text-blue-600"
            >
              Shop
            </Link>

            <span className="text-gray-300">|</span>

            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Free Delivery
            </span>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">

            {!isLoggedIn() ? (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-gray-700 hover:text-blue-600"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={logout}
                className="text-sm font-semibold text-red-600 hover:text-red-700"
              >
                Logout
              </button>
            )}

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-full transition cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
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

              {totalItemsCount > 0 && (
                <span className="absolute top-0 right-0 min-w-5 h-5 flex items-center justify-center px-1 bg-red-500 text-white text-xs font-bold rounded-full">
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