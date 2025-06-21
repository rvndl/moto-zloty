interface Props {
  label: string;
  value?: string;
}

const DataItem = ({ label, value }: Props) => {
  return (
    <div className="flex flex-col gap-1">
      <p className="font-semibold">{label}</p>
      <p className="text-sm text-muted">{value}</p>
    </div>
  );
};

export { DataItem };
