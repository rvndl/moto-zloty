/** @jsxRuntime automatic */
/** @jsxImportSource satori/jsx */

import type { JSXNode } from "satori/jsx";
import { Footer } from "./footer";
import { Layout } from "./layout";
import { Motorcycle } from "./motorcycle";

interface Props {
  title: string;
  logoSrc: string;
  tileSrc: string;
  children: JSXNode;
  gap?: number;
}

export const SlideShell = ({
  children,
  title,
  logoSrc,
  tileSrc,
  gap = 24,
}: Props) => {
  return (
    <Layout title={title} logoSrc={logoSrc} tileSrc={tileSrc}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap,
          position: "relative",
          flex: 1,
        }}
      >
        {children}

        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 54,
            right: -120,
            opacity: 0.08,
          }}
        >
          <Motorcycle />
        </div>

        <div
          style={{
            position: "absolute",
            display: "flex",
            left: 0,
            right: 0,
            bottom: -36,
          }}
        >
          <Footer />
        </div>
      </div>
    </Layout>
  );
};
