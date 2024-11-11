import { PublicAccount } from "./account";

export type EventStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Event {
  id: string;
  name: string;
  description: string;
  address: string;
  status: EventStatus;
  longitude: number;
  latitude: number;
  date_from: string;
  date_to: string;
  banner_id?: string;
  created_at: string;
  account_id: string;
  account?: PublicAccount;
}
