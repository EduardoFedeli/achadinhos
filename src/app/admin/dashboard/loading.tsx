export default function DashboardLoading() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="mb-8 space-y-2">
        <div className="h-8 w-64 bg-[#1A1A24] rounded-lg" />
        <div className="h-4 w-48 bg-[#1A1A24] rounded-lg" />
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-[#1A1A24] rounded-2xl border border-[#2A2A35]" />
        ))}
      </div>

      {/* Analytics Row Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[400px] bg-[#1A1A24] rounded-[24px] border border-[#2A2A35]" />
        <div className="h-[400px] bg-[#1A1A24] rounded-[24px] border border-[#2A2A35]" />
      </div>

      {/* Activity Row Skeleton */}
      <div className="h-48 bg-[#1A1A24] rounded-[24px] border border-[#2A2A35]" />
    </div>
  );
}