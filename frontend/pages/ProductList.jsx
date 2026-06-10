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
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error: {error.message}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-center py-8">
        Product Store
      </h1>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div>No products found</div>
        )}
      </div>
    </div>
  );
}

export default ProductList;