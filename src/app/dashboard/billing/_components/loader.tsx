export default function SubscriptionSkeleton() {
  return (
    <div className="min-h-screen w-full bg-gray-50 space-y-6">
      {/* Current Plans Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="h-4 bg-gray-200 rounded w-24 mb-4 animate-pulse"></div>
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-gray-200 rounded w-40 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
          </div>
          <div className="flex gap-3">
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Plans Benefit */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <div className="h-6 bg-gray-200 rounded w-48 mb-6 animate-pulse"></div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded flex-1 animate-pulse"></div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded flex-1 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Next Invoice */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="h-6 bg-gray-200 rounded w-32 mb-6 animate-pulse"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Method */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-sm p-6">
          <div className="h-6 bg-gray-200 rounded w-40 mb-6 animate-pulse"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
            <div className="flex gap-3 mt-6">
              <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Recent Invoice */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <div className="h-6 bg-gray-200 rounded w-32 mb-6 animate-pulse"></div>
          <div className="overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 pb-4 border-b border-gray-200">
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
            </div>
            {/* Table Rows */}
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="grid grid-cols-4 gap-4 py-4 border-b border-gray-100"
              >
                <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
