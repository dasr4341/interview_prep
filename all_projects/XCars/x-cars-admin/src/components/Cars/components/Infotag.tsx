export default function InfoTag({
  label,
  value,
}: {
  label?: string;
  value: string | number | undefined | null;
}) {
  return (
    <>
      {value ? (
        <div className="flex items-center gap-2 justify-start text-blue-800 bg-blue-200 bg-opacity-20 rounded-lg py-2 px-3 w-fit text-xs ">
          {label && <div className=" font-bold  capitalize ">{label}</div>}
          <div>{value}</div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
