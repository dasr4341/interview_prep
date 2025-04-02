export default function Calendar({ className }: { className?: string }) {
  return (
    <svg
      width="30"
      height="30"
      className={className}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        // eslint-disable-next-line max-len
        d="M12.0138 1V5M6.01379 1V5M1.01379 9H17.0138M17.0138 9V17C17.0138 18.1046 16.1184 19 15.0138 19H3.01379C1.90922 19 1.01379 18.1046 1.01379 17V5C1.01379 3.89543 1.90922 3 3.01379 3H15.0138C16.1184 3 17.0138 3.89543 17.0138 5V9Z"
        stroke="#000000"
      />
    </svg>
  );
}
