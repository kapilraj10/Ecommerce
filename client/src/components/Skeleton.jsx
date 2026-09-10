const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100/80 overflow-hidden">
    <div className="aspect-square skeleton" />
    <div className="p-4 space-y-3">
      <div className="h-4 skeleton rounded w-3/4" />
      <div className="h-4 skeleton rounded w-1/2" />
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-3 w-3 skeleton rounded-full" />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <div className="h-5 skeleton rounded w-20" />
        <div className="h-4 skeleton rounded w-14" />
      </div>
      <div className="h-10 skeleton rounded-xl w-full" />
    </div>
  </div>
);

const SkeletonProductDetail = () => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className="space-y-4">
        <div className="aspect-square skeleton rounded-2xl" />
        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-20 h-20 skeleton rounded-xl" />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-4 skeleton rounded w-24" />
        <div className="h-8 skeleton rounded w-3/4" />
        <div className="h-4 skeleton rounded w-40" />
        <div className="h-10 skeleton rounded w-32" />
        <div className="h-4 skeleton rounded w-20" />
        <div className="h-20 skeleton rounded-xl" />
        <div className="h-12 skeleton rounded-xl w-full" />
      </div>
    </div>
  </div>
);

const SkeletonReview = () => (
  <div className="bg-white rounded-2xl border border-gray-100/80 p-6 space-y-3">
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-4 w-4 skeleton rounded-full" />
      ))}
    </div>
    <div className="h-4 skeleton rounded w-32" />
    <div className="h-4 skeleton rounded w-full" />
    <div className="h-4 skeleton rounded w-2/3" />
  </div>
);

export { SkeletonCard, SkeletonProductDetail, SkeletonReview };
