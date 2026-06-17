type AdminStatProps = {
  label: string;
  value: number;
};

export const AdminStat = ({ label, value }: AdminStatProps) => {
  return (
    <div className="bg-background p-8">
      <p className="tracking-eyebrow text-muted-foreground text-[10px] uppercase">
        {label}
      </p>
      <p className="font-display mt-2 text-4xl">{value}</p>
    </div>
  );
};
