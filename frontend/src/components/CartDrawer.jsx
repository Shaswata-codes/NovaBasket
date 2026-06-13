import { useCart } from "../context/CartContext";

function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cart, updateQuantity, removeFromCart } = useCart();

  const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/100?text=No+Image";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    return `${apiUrl}${imagePath}`;
  };

  const handleDecreaseQuantity = (item) => {
    if (item.quantity > 1) {
      updateQuantity(item.product, item.quantity - 1);
    } else {
      removeFromCart(item.product);
    }
  };

  const handleIncreaseQuantity = (item) => {
    updateQuantity(item.product, item.quantity + 1);
  };

  const items = cart.items || [];
  const subtotal = parseFloat(cart.total) || 0;
  const deliveryFee = subtotal > 0 && subtotal < 1000 ? 99 : 0;
  const grandTotal = subtotal + deliveryFee;

  return (
    <div 
      className={`fixed inset-0 z-50 overflow-hidden transition-opacity duration-300 ${isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
      aria-modal="true" 
      role="dialog"
    >
      {/* Backdrop overlay */}
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={() => setIsCartOpen(false)}
      ></div>

      {/* Slide-over Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className={`w-screen max-w-md transform transition-transform duration-300 ease-out bg-white shadow-2xl flex flex-col relative ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Shopping Cart
              {items.length > 0 && (
                <span className="text-sm font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  {items.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition duration-200 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 py-6 overflow-y-auto px-6 space-y-4 scrollbar-thin">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">Your cart is empty</h3>
                <p className="text-sm text-gray-500 mb-6 max-w-xs">Looks like you haven't added anything to your cart yet.</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl transition duration-200 shadow-md cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow duration-300"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0 flex items-center justify-center">
                    <img
                      src={getImageUrl(item.product_image)}
                      alt={item.product_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/100?text=No+Image";
                      }}
                    />
                  </div>

                  {/* Info details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-800 truncate mb-0.5">
                      {item.product_name}
                    </h4>
                    <p className="text-xs font-semibold text-emerald-600 mb-2">
                      ₹{parseFloat(item.product_price).toFixed(2)}
                    </p>

                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-8">
                        <button
                          onClick={() => handleDecreaseQuantity(item)}
                          className="px-2.5 h-full hover:bg-gray-50 text-gray-500 hover:text-gray-800 transition duration-150 font-bold text-sm cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-3 text-xs font-bold text-gray-700 select-none bg-gray-50/30 flex items-center justify-center h-full min-w-8">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleIncreaseQuantity(item)}
                          className="px-2.5 h-full hover:bg-gray-50 text-gray-500 hover:text-gray-800 transition duration-150 font-bold text-sm cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      {/* Subtotal of Item */}
                      <span className="text-sm font-extrabold text-gray-800">
                        ₹{(parseFloat(item.product_price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.product)}
                    className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition duration-200 cursor-pointer self-start"
                    aria-label="Remove Item"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Sticky Checkout Summary Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-100 px-6 py-6 bg-gray-50/50 space-y-4">
              <div className="space-y-2.5">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-gray-900">
                    {deliveryFee > 0 ? `₹${deliveryFee.toFixed(2)}` : "FREE"}
                  </span>
                </div>
                <div className="h-px bg-gray-200 my-1"></div>
                <div className="flex justify-between text-base font-extrabold text-gray-900">
                  <span>Total</span>
                  <span className="text-xl text-blue-600">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Mock Promo Code */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo code (e.g. WELCOME)"
                  className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500 transition-colors uppercase"
                />
                <button className="bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-black transition duration-200 cursor-pointer">
                  Apply
                </button>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => alert("Checkout flow is not implemented in this demo.")}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-2 active:scale-98 cursor-pointer text-base"
              >
                Proceed to Checkout
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CartDrawer;
