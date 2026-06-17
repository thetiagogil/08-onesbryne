type ProductDetailRowProps = {
  label: string;
  value: string;
};

export const ProductDetailRow = ({ label, value }: ProductDetailRowProps) => {
  return (
    <div className="grid grid-cols-[8rem_minmax(0,1fr)] items-center gap-6 py-4">
      <dt className="tracking-eyebrow text-muted-foreground text-[11px] uppercase">
        {label}
      </dt>
      <dd className="min-w-0 text-right">{value}</dd>
    </div>
  );
};
