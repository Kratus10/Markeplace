export default function SubscriptionCTA() {
  return (
    <div className="bg-gradient-to-br from-primary-500 to-secondary-600 rounded-2xl p-6 text-white shadow-xl">
      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white/20 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </div>
      <h3 className="text-xl font-bold mb-2">Get Exclusive Trading Signals</h3>
      <p className="text-white/90 mb-6">Subscribe to our premium service for daily expert analysis and trading alerts.</p>
      <div className="space-y-3">
        <div className="relative">
          <input
            type="email"
            placeholder="Your email address"
            className="w-full px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 placeholder-gray-500"
          />
        </div>
        <button className="w-full bg-white text-primary-600 font-semibold py-3 px-4 rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl">
          Subscribe Now
        </button>
      </div>
      <p className="text-white/70 text-xs mt-4 text-center">Join 10,000+ traders who get exclusive insights</p>
    </div>
  );
}
