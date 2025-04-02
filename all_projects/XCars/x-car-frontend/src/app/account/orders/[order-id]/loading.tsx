const Loading = () => {
  return (
    <div className="flex flex-col mx-auto py-12 w-full items-center text-center">
      <div className="w-2/6 shadow-xl rounded-xl overflow-hidden pb-6">
        {/* Header Loader */}
        <div className="bg-gray-300 animate-pulse px-10 pb-20 flex flex-col gap-4 items-center">
          <div className="self-start mt-10 w-8 h-8 bg-gray-400 rounded-full animate-pulse" />
          <div className="w-12 h-12 bg-gray-400 rounded-full animate-pulse" />
          <div className="w-1/2 h-8 bg-gray-400 rounded animate-pulse mt-4" />
        </div>

        <div className="flex flex-col gap-1 p-6 py-10">
          <div className="w-1/2 h-6 bg-gray-400 rounded animate-pulse mx-auto" />
          <div className="w-full h-4 bg-gray-300 rounded animate-pulse my-2" />
          <div className="w-3/4 h-4 bg-gray-300 rounded animate-pulse mx-auto my-2" />
          <div className="w-1/2 h-4 bg-gray-300 rounded animate-pulse mx-auto my-2" />

          <div className="w-1/3 h-4 bg-gray-400 rounded animate-pulse mx-auto my-4" />
        </div>

        <div className="w-1/2 h-10 bg-orange-300 rounded-full animate-pulse mx-auto mb-10" />
      </div>
    </div>
  );
};

export default Loading;
