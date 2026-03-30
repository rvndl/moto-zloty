/** @jsxRuntime automatic */
/** @jsxImportSource satori/jsx */

import type { JSXNode } from "satori/jsx";
import { Header } from "./header";

interface Props {
  title: string;
  children: JSXNode;
  logoSrc: string;
  tileSrc: string;
}

export const Layout = ({ children, title, logoSrc, tileSrc }: Props) => {
  return (
    <div
      style={{
        background: "black",
        width: "100%",
        height: "100%",
        color: "#ffffffd0",
        fontFamily: "Geist",
        fontSize: 36,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header title={title} logoSrc={logoSrc} tileSrc={tileSrc} />

      <div
        style={{
          background: "black",
          padding: "64px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          color: "#f2f2f2",
        }}
      >
        {children}
      </div>
    </div>
  );
};
