export default function Button({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`w-full rounded-xl bg-linear-to-r from-sky-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:from-sky-700 hover:to-indigo-700 ${className}`}
    >
      {children}
    </button>
  );
}