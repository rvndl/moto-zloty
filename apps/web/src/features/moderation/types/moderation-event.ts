import { api, InferResponse } from "api/eden";

export type ModerationEvents = InferResponse<typeof api.mod.events.get>;
export type ModerationEvent = ModerationEvents[number];
