import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getAccessToken } from "../utils/auth";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Product not found or failed to fetch details");
        }
        return response.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = async () => {
    const token = getAccessToken();

    if (!token) {
      navigate("/login");
      return;
    }

    await addToCart(product.id, 1);
  };

  const handleBuyNow = async () => {
    const token = getAccessToken();

    if (!token) {
      navigate("/login");
      return;
    }

    await addToCart(product.id, 1);
    navigate("/checkout");
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath)
      return "https://via.placeholder.com/600x600?text=No+Image";

    if (
      imagePath.startsWith("http://") ||
      imagePath.startsWith("https://")
    ) {
      return imagePath;
    }

    return `${import.meta.env.VITE_API_URL}${imagePath}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>

        <p className="mt-4 text-gray-600 font-medium animate-pulse">
          Loading product details...
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full text-center border border-gray-100">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Error Loading Product
          </h2>

          <p className="text-gray-600 mb-6">
            {error?.message || "Product could not be found"}
          </p>

          <Link
            to="/"
            className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition duration-200 w-full shadow-lg shadow-blue-500/20"
          >
            Back to Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors mb-8 group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Store
        </Link>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 p-6 sm:p-8 lg:p-12">
          {/* Image */}
          <div className="relative aspect-square lg:h-[500px] rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center group shadow-inner">
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/600x600?text=No+Image";
              }}
            />

            {product.category && (
              <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-gray-800 text-xs font-bold px-4 py-2 rounded-full shadow-md border border-gray-100">
                {product.category.name}
              </span>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-between">
            <div>
              {product.category && (
                <span className="text-xs font-bold tracking-wider text-blue-600 uppercase mb-2 block">
                  {product.category.name}
                </span>
              )}

              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-2 mb-6">
                <span className="text-3xl font-extrabold text-emerald-600">
                  ₹{product.price}
                </span>

                <span className="text-sm text-gray-500 bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-semibold">
                  In Stock
                </span>
              </div>

              <hr className="border-gray-100 my-6" />

              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">
                  Description
                </h3>

                <p className="text-gray-600 leading-relaxed text-base">
                  {product.description ||
                    "No description provided for this product."}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-4 items-center">
              <button
                onClick={handleAddToCart}
                className="flex-1 w-full bg-blue-600 hover:bg-blue-700 text-white text-base font-bold px-8 py-4 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 w-full bg-gray-900 hover:bg-black text-white text-base font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 cursor-pointer"
              >
                Buy Now
              </button>

              <div className="sm:ml-auto">
                <Link
                  to="/"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors py-2 px-3 hover:bg-gray-50 rounded-xl"
                >
                  Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;