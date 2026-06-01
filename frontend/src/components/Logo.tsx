export default function Logo({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="8" fill="#2563EB" />
      <path
        d="M8 22V10h4l4 6 4-6h4v12h-4v-7l-4 6-4-6v7H8z"
        fill="white"
      />
    </svg>
  );
}
