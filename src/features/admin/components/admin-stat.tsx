type AdminStatProps = {
  label: string;
  value: number;
};

export function AdminStat({ label, value }: AdminStatProps) {
  return (
    <div className="bg-background p-8">
      <p className="text-[10px] tracking-eyebrow text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-2 font-display text-4xl">{value}</p>
    </div>
  );
}
