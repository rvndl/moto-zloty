/** @jsxRuntime automatic */
/** @jsxImportSource satori/jsx */

interface Props {
  title: string;
  logoSrc: string;
  tileSrc: string;
}

export const Header = ({ title, logoSrc, tileSrc }: Props) => {
  return (
    <div
      style={{
        background: "white",
        position: "relative",
        width: "100%",
        height: 160,
        display: "flex",
      }}
    >
      <div
        style={{
          background: "white",
          backgroundImage: `url(${tileSrc})`,
          backgroundRepeat: "repeat",
          backgroundSize: "150px 150px",
          position: "absolute",
          width: 2000,
          height: 2000,
          display: "flex",
          top: -600,
          left: -600,
          opacity: 0.15,
          transform: "rotate(-45deg)",
          overflow: "hidden",
        }}
      />
      <img
        width={96}
        height={96}
        style={{ position: "absolute", top: 32, left: 32 }}
        src={logoSrc}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          justifyContent: "center",
        }}
      >
        <p
          style={{
            fontFamily: "Geist",
            fontWeight: 800,
            fontSize: 52,
            margin: 0,
            color: "black",
          }}
        >
          {title}
        </p>
      </div>
    </div>
  );
};
