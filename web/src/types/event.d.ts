import { PublicAccount } from "./account";
import { Address } from "./address";

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
  banner_small_id?: string;
  created_at: string;
  account_id: string;
  account?: PublicAccount;

  full_address_id?: string;
  full_address?: Address;
}
