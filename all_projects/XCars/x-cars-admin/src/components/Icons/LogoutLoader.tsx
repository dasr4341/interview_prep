const LogoutLoader = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center absolute top-0 left-0 z-20 bg-gray-50/70 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center h-full">
        <svg
          className="w-16 h-16"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 200 200"
        >
          <linearGradient id="a11">
            <stop offset="0" stop-color="#0C17FF" stop-opacity="0"></stop>
            <stop offset="1" stop-color="#0C17FF"></stop>
          </linearGradient>
          <circle
            fill="none"
            stroke="url(#a11)"
            stroke-width="26"
            stroke-linecap="round"
            stroke-dasharray="0 44 0 44 0 44 0 44 0 360"
            cx="100"
            cy="100"
            r="70"
            transform-origin="center"
          >
            <animateTransform
              type="rotate"
              attributeName="transform"
              calcMode="discrete"
              dur="2"
              values="360;324;288;252;216;180;144;108;72;36"
              repeatCount="indefinite"
            ></animateTransform>
          </circle>
        </svg>
        <p className="mt-4 text-lg font-medium text-gray-600">Logging out...</p>
      </div>
    </div>
  );
};

export default LogoutLoader;
