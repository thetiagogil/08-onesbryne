type ProductDetailRowProps = {
  label: string;
  value: string;
};

export function ProductDetailRow({ label, value }: ProductDetailRowProps) {
  return (
    <div className="grid grid-cols-[8rem_minmax(0,1fr)] items-center gap-6 py-4">
      <dt className="text-[11px] tracking-eyebrow text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="min-w-0 text-right">{value}</dd>
    </div>
  );
}
