// src/components/work-orders/progress-bar.tsx
export function ProgressBar({ value }: { value: number }) {
  const color =
    value === 100 ? "bg-teal-500" : value > 50 ? "bg-blue-500" : "bg-zinc-300";
  return (
    <div className="w-full bg-zinc-100 rounded-full h-1.5">
      <div
        className={`h-1.5 rounded-full transition-all ${color}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
