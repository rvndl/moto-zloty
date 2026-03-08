import { type InferResponse, api } from "api/eden";

export type Account = InferResponse<ReturnType<typeof api.account>["get"]>;
export type AccountRank = Account["rank"];
export type AccountEvent = NonNullable<Account["events"]>[number];
