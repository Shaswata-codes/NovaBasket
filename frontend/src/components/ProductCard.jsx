import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const imageUrl = product.image
    ? `${import.meta.env.VITE_API_URL}${product.image}`
    : "";

  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product.id, 1);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col h-full justify-between"
    >
      <div>
        <div className="relative overflow-hidden aspect-video bg-gray-50 flex items-center justify-center">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/300x200?text=No+Image";
            }}
          />
        </div>

        <div className="p-5">
          <h3 className="text-base font-bold text-gray-800 mb-1.5 truncate">
            {product.name}
          </h3>

          <p className="text-gray-500 text-xs mb-4 line-clamp-2 h-8 leading-relaxed">
            {product.description || "No description provided for this product."}
          </p>
        </div>
      </div>

      <div className="px-5 pb-5 pt-0 flex justify-between items-center border-t border-gray-50 mt-auto">
        <span className="text-lg font-extrabold text-emerald-600">
          ₹{parseFloat(product.price).toFixed(2)}
        </span>

        <button 
          onClick={handleAddToCart}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all duration-200 active:scale-95 cursor-pointer shadow-md shadow-blue-500/10 hover:shadow-blue-500/20"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;