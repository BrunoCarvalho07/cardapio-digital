export default function Logo({ size = 80 }) {
  return (
    <div className="flex justify-center mb-2">
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="logo-float drop-shadow-md"
      >
        <circle cx="50" cy="50" r="48" fill="#1B4965" />
        <circle cx="50" cy="50" r="48" fill="none" stroke="#E8A33D" strokeWidth="3" />

        {/* Garfo */}
        <g fill="#FBF9F4">
          <rect x="32" y="22" width="3" height="26" rx="1.5" />
          <rect x="37" y="22" width="3" height="26" rx="1.5" />
          <rect x="42" y="22" width="3" height="26" rx="1.5" />
          <path d="M32,48 Q32,58 38.5,58 Q45,58 45,48 Z" />
          <rect x="37" y="56" width="3" height="24" rx="1.5" />
        </g>

        {/* Faca */}
        <g fill="#FBF9F4">
          <path d="M62,22 Q70,22 70,40 Q70,50 64,54 L61,54 L61,22 Z" />
          <rect x="61" y="53" width="3" height="27" rx="1.5" />
        </g>
      </svg>
    </div>
  );
}