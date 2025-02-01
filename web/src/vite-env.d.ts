/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    bolded?: boolean;
    rightAligned?: boolean;
  }
}
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_PUBLIC_URL: string;
  readonly VITE_SITE_NAME: string;
  readonly VITE_TURNSTILE_KEY: string;
  readonly VITE_PRIVACY_ADMIN_FULL_NAME: string;
  readonly VITE_PRIVACY_CONTACT_EMAIL: string;
  readonly VITE_PRIVACY_SITE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
