"use client";
import NavigationSidebar from "@/components/NavigationSidebar";
import PageHeader from "@/components/PageHeader";

export default function TokensPage() {
  const tokenPackages = [
    { id: 1, name: "Starter Pack", price: "$9.99", tokens: "100 Tokens" },
    { id: 2, name: "Basic Pack", price: "$19.99", tokens: "250 Tokens" },
    { id: 3, name: "Pro Pack", price: "$39.99", tokens: "600 Tokens" },
    { id: 4, name: "Premium Pack", price: "$69.99", tokens: "1200 Tokens" },
   ];

  return (
    <div className="min-h-screen bg-[#F5E8C7]">
      <NavigationSidebar activePage="tokens" />
      <div className="md:ml-80 min-h-screen flex flex-col">
        <PageHeader />

        {/* Main Content */}
        <main className="flex-1 bg-[#F9FAFB] px-4 md:px-12 py-6 md:py-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8">
              <div className="mb-4 md:mb-0">
                <h1 className="text-2xl md:text-4xl font-bold text-warm-brown mb-2">
                  Buy Tokens
                </h1>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-warm-brown rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">?</span>
                  </span>
                </div>
              </div>
              <div className="text-left md:text-right">
                <p className="text-gray-700 font-medium text-sm md:text-base">
                  Customize,
                </p>
                <p className="text-gray-700 font-medium text-sm md:text-base">
                  upscale, and
                </p>
                <p className="text-gray-700 font-medium text-sm md:text-base">
                  deploy with ease
                </p>
              </div>
            </div>

            {/* Token Packages Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {tokenPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-soft-cream rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center min-h-[240px] md:min-h-[280px] hover:shadow-lg transition-shadow">
                  <div className="text-center mb-6 md:mb-8">
                    <h3 className="text-lg md:text-xl font-bold text-warm-brown mb-2">
                      {pkg.name}
                    </h3>
                    <p className="text-xl md:text-2xl font-bold text-warm-brown mb-1">
                      {pkg.price}
                    </p>
                    <p className="text-gray-600 text-sm md:text-base">
                      {pkg.tokens}
                    </p>
                  </div>
                  <button className="bg-warm-brown text-white px-6 md:px-8 py-2.5 md:py-3 rounded-full font-medium hover:bg-opacity-90 transition-colors text-sm md:text-base">
                    Get Started
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
