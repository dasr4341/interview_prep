export default function PrevIcon({ className, stroke }: { className?: string, stroke?:string }) {
  return (
    <svg
      width="10"
      height="18"
      className={className}
      viewBox="0 0 10 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path d="M9 1L1 9L9 17" stroke={stroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
