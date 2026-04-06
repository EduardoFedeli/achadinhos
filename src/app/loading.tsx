export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-[#0F0F13] flex flex-col pb-20 animate-pulse">
      {/* Header Skeleton */}
      <div className="h-20 w-full border-b border-[#2A2A35] bg-[#1A1A24]/50" />

      {/* Hero Banner Skeleton */}
      <div className="h-[400px] w-full bg-[#1A1A24]" />

      <main className="w-full max-w-7xl mx-auto px-4 md:px-8 space-y-12 mt-8">
        {/* Category Grid Skeleton */}
        <div className="grid grid-cols-4 md:grid-cols-11 gap-4">
          {[...Array(11)].map((_, i) => (
            <div key={i} className="aspect-square bg-[#1A1A24] rounded-2xl" />
          ))}
        </div>

        {/* Vitrine Skeleton */}
        <div className="bg-[#1A1A24]/20 p-10 rounded-[40px] border border-[#2A2A35]">
          <div className="h-8 w-48 bg-[#1A1A24] rounded-lg mb-10" />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-square bg-[#1A1A24] rounded-[24px]" />
                <div className="h-4 w-full bg-[#1A1A24] rounded" />
                <div className="h-4 w-2/3 bg-[#1A1A24] rounded" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}