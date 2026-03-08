import { api, InferResponse } from "api/eden";

export type ModerationAccounts = InferResponse<typeof api.mod.accounts.get>;
export type ModerationAccount = ModerationAccounts[number];
