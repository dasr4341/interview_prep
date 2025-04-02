export default function DownArrowIcon({ className }: { className?: string }) {
  return (
    <svg
    width="13"
    height="17"
      className={className}
      viewBox="0 0 8 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 9L4 1M4 9L1 6M4 9L7 6"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
