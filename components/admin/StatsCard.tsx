export default function StatsCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
      <p className="text-sm text-neutral-400">{title}</p>
      <h3 className="text-2xl font-semibold mt-2">{value}</h3>
    </div>
  );
}
