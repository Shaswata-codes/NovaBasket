function ProductCard({ product }) {
  
  const imageUrl = product.image
    ? `${import.meta.env.VITE_API_URL}${product.image}`
    : "";

  console.log("Image URL:", imageUrl);

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <img
        src={imageUrl}
        alt={product.name}
        className="w-full h-56 object-cover"
        onError={(e) => {
          e.target.src =
            "https://via.placeholder.com/300x200?text=No+Image";
        }}
      />

      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          {product.name}
        </h2>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-green-600">
            ₹{product.price}
          </span>

          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;