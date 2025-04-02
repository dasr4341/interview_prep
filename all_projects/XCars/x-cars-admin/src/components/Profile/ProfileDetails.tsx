export function ProfileDetails({
  label,
  value,
  loading,
}: {
  label: string;
  value: string | null | undefined;
  loading: boolean;
}) {
  return (
    <div className=" flex flex-col items-start gap-2 w-11/12 md:w-4/6">
      <span className=" font-light text-base text-gray-700 tracking-wide">
        {label}
      </span>
      <div
        className={` bg-gray-200 text-gray-500 tracking-wide w-full px-6 rounded-md py-3 ${loading ? 'animate-pulse h-10 ' : ''}`}
      >
        {!loading && value}
      </div>
    </div>
  );
}
