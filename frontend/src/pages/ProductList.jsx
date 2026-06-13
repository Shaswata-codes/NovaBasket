import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/products/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 font-semibold animate-pulse text-sm">
          Loading products...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-[80vh] flex items-center justify-center text-red-500 font-semibold">
        Error: {error.message}
      </div>
    );

  return (
    <div className="bg-gray-50/50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
            Explore Our Collection
          </h1>
          <p className="text-sm sm:text-base text-gray-500 max-w-lg mx-auto leading-relaxed">
            Premium products curated specifically for your everyday comfort and performance. Free delivery on orders over ₹1,000.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500 font-medium bg-white border border-gray-100 rounded-3xl">
              No products found. Check back later!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductList;