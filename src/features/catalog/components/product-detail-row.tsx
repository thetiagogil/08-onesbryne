type ProductDetailRowProps = {
  label: string;
  value: string;
};

export function ProductDetailRow({ label, value }: ProductDetailRowProps) {
  return (
    <div className="grid grid-cols-[minmax(7rem,1fr)_minmax(0,1fr)] items-center gap-6 py-4">
      <dt className="text-[11px] tracking-eyebrow text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="text-right capitalize">{value}</dd>
    </div>
  );
}
