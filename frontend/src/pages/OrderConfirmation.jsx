import { useParams, Link } from "react-router-dom";

function OrderConfirmation() {
  const { id } = useParams();

  // Generate an estimated delivery date (e.g., 5 days from today)
  const getDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 5);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-gray-50/50 py-16 px-4 sm:px-6 lg:px-8 min-h-[80vh] flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center animate-fade-in">
        {/* Animated Checkmark Circle */}
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-50 border-4 border-green-100 mb-6 animate-bounce-subtle">
          <svg
            className="h-10 w-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-black text-gray-900 mb-2">
          Thank You!
        </h1>
        <p className="text-gray-500 font-medium text-sm mb-6">
          Your order has been placed successfully.
        </p>

        {/* Order Details Card */}
        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 text-left space-y-4 mb-8">
          <div className="flex justify-between items-center pb-3 border-b border-gray-200/50">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Order ID
            </span>
            <span className="text-sm font-bold text-gray-800">
              #ORD-{id || "N/A"}
            </span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-gray-200/50">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Status
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
              Confirmed
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
              Estimated Delivery
            </span>
            <span className="text-sm font-bold text-gray-800">
              {getDeliveryDate()}
            </span>
          </div>
        </div>

        {/* Call to Actions */}
        <div className="space-y-3">
          <Link
            to="/"
            className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-bold rounded-2xl shadow-md text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-[1.02] active:scale-95"
          >
            Continue Shopping
          </Link>
          <p className="text-xs text-gray-400 font-medium pt-2">
            A confirmation email will be sent to you shortly.
          </p>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;
