/** @jsxRuntime automatic */
/** @jsxImportSource satori/jsx */

interface Props {
  state: string;
  count: number;
}

export const TopStateCard = ({ state, count }: Props) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        minWidth: 220,
        padding: "18px 20px",
        borderRadius: 22,
        background: "#00000040",
        border: "1px solid #ffffff10",
      }}
    >
      <p style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>{state}</p>
      <p style={{ margin: 0, fontSize: 22, opacity: 0.7 }}>{count} wydarzeń</p>
    </div>
  );
};
