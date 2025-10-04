import { FiShoppingCart, FiX, FiAlertCircle } from 'react-icons/fi';

const NewProductOfferPopup = ({ show, product, onClose, onOrder }) => {
  if (!show || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full mx-auto shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiAlertCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">New Product Alert!</h3>
              <p className="text-sm text-gray-500">Limited Time Offer</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Product Info */}
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center text-2xl">
              {product.image}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{product.name}</h4>
              <p className="text-sm text-gray-500">{product.category}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-lg font-bold text-green-600">{product.price}</span>
                <span className="text-sm text-gray-400 line-through">{product.originalPrice}</span>
              </div>
            </div>
          </div>

          {/* Offer Details */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-yellow-800">
                {product.offerDescription}
              </span>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                {product.discount}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm text-yellow-700">
              <span>Wholesale Price</span>
              <span className="font-semibold">{product.wholesalePrice}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-yellow-700">
              <span>Normal Price After</span>
              <span className="font-semibold">{product.normalPrice}</span>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-red-700">Offer expires in:</span>
              <span className="text-sm font-bold text-red-700">
                {product.daysRemaining} days
              </span>
            </div>
            <div className="w-full bg-red-200 rounded-full h-2 mt-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(product.daysRemaining / 10) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Maybe Later
          </button>
          <button
            onClick={() => onOrder(product)}
            className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
          >
            <FiShoppingCart className="w-4 h-4 mr-2" />
            Order Now & Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewProductOfferPopup;