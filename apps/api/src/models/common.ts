import { t } from "elysia";

export const ErrorResponse = t.Object({
  error: t.String({ description: "Error message" }),
});

export const SuccessResponse = t.Object({
  success: t.Boolean(),
  message: t.Optional(t.String()),
});

export const PaginationQuery = t.Object({
  page: t.Optional(t.Number({ minimum: 1, default: 1 })),
  limit: t.Optional(t.Number({ minimum: 1, maximum: 100, default: 20 })),
});

export type ErrorResponseType = typeof ErrorResponse.static;
export type SuccessResponseType = typeof SuccessResponse.static;
export type PaginationQueryType = typeof PaginationQuery.static;
