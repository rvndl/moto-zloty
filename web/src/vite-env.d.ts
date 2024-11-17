/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    bolded: boolean;
  }
}
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_PUBLIC_URL: string;
  readonly VITE_SITE_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
