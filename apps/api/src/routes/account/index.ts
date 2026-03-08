import { Elysia } from "elysia";
import { detailsRoute } from "./details";
import { changePasswordRoute } from "./change-password";

export { listRoute as modAccountsRoute } from "./list";

export const accountRoutes = new Elysia({
  name: "routes.account",
  prefix: "/account",
})
  .use(detailsRoute)
  .use(changePasswordRoute);
