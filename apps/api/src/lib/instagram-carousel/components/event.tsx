/** @jsxRuntime automatic */
/** @jsxImportSource satori/jsx */

import { CalendarIcon } from "./icons/calendar";
import { PinIcon } from "./icons/pin";

interface Props {
  name: string;
  url: string;
  dateFrom: string;
  dateTo: string;
  location: string;
}

export const Event = ({ name, url, dateFrom, dateTo, location }: Props) => {
  return (
    <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
      <img
        src={url}
        alt={name}
        width={100}
        height={100}
        style={{ borderRadius: 16, objectFit: "cover" }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <p style={{ margin: 0 }}>{name}</p>

        <div style={{ display: "flex", gap: 24, fontSize: 24, opacity: 0.8 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <CalendarIcon />
            <p style={{ margin: 0 }}>
              {dateFrom} - {dateTo}
            </p>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <PinIcon />
            <p style={{ margin: 0 }}>{location}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
