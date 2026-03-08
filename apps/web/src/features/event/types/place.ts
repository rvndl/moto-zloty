import { type InferResponse, api } from "api/eden";

// Place search response
export type Places = InferResponse<ReturnType<typeof api.placeSearch>["get"]>;
export type Place = Places[number];
