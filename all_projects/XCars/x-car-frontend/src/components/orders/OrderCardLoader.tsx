export function OrderCardsLoader() {
  return (
    <div className="w-full flex flex-col gap-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="w-full flex justify-between items-center bg-gray-200 rounded-md p-4 bg-opacity-75 animate-pulse"
        >
          <div className="flex flex-col gap-1 w-2/3">
            <div className="flex items-center gap-2">
              <div className="h-4 bg-gray-300 rounded w-20"></div>
              <div className="h-4 bg-gray-300 rounded w-28"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 bg-gray-300 rounded w-20"></div>
              <div className="h-4 bg-gray-300 rounded w-24"></div>
            </div>
          </div>
          <div className="h-4 bg-gray-300 rounded w-16"></div>
        </div>
      ))}
    </div>
  );
}

export default OrderCardsLoader;
