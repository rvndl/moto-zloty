/** @jsxRuntime automatic */
/** @jsxImportSource satori/jsx */

interface Props {
  label: string;
  value: number | string;
}

export const StatCard = ({ label, value }: Props) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        flex: 1,
        padding: "28px",
        borderRadius: 28,
        background: "#ffffff06",
        border: "1px solid #ffffff10",
      }}
    >
      <p style={{ margin: 0, fontSize: 22, opacity: 0.7 }}>{label}</p>
      <p
        style={{
          margin: 0,
          fontSize: 52,
          fontWeight: 800,
          color: "#f8fafc",
        }}
      >
        {value}
      </p>
    </div>
  );
};
