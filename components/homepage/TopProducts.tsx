export default function TopProducts() {
  return (
    <div className="feature-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Top Performing Products</h3>
        <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
          <option>24h</option>
          <option>7d</option>
          <option>30d</option>
        </select>
      </div>
      <ul className="space-y-4">
        {[1, 2, 3].map((item) => (
          <li key={item} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <div className="bg-gradient-to-br from-primary-100 to-accent-100 border-2 border-dashed border-primary-200 rounded-xl w-16 h-16 flex items-center justify-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">Product {item}</h4>
              <p className="text-gray-600 text-sm mt-1">High-performance trading tool</p>
              <div className="flex items-center mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full" style={{ width: `${70 + item * 10}%` }}></div>
                </div>
                <span className="text-xs font-medium text-gray-700 ml-2">9{item}%</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <button className="w-full py-3 text-center text-primary-600 font-medium rounded-lg border border-primary-200 hover:bg-primary-50 transition-colors duration-200">
          View All Products
        </button>
      </div>
    </div>
  );
}
