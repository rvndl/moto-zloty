export interface Event {
  id: string;
  name: string;
  description: string;
  address: string;
  status: string;
  longitude: number;
  latitude: number;
  date_from: string;
  date_to: string;
  banner_id?: string;
  created_at: string;
  account_id: string;
}
