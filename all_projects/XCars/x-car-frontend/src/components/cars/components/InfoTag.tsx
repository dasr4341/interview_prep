const InfoTag = ({ label }: { label: number | string | undefined | null }) => (
  <span className="text-gray-600 text-sm tracking-wide bg-gray-200 py-1 px-3 rounded-lg ">
    {label || 'NA'}
  </span>
);

export default InfoTag;
