type SpinnerProps = {
  label?: string;
  fullPage?: boolean;
};

export default function Spinner({ label = "Loading...", fullPage = false }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center gap-3 text-base-content/70 ${
        fullPage ? "min-h-[50vh] flex-1" : "py-16"
      }`}
    >
      <span className="loading loading-ring loading-lg text-primary" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
