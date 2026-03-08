import { Elysia } from "elysia";
import { updateStatusRoute } from "./update-status";
import { updateAddressRoute } from "./update-address";

export { listRoute as modEventsRoute } from "./list";

export const moderationRoutes = new Elysia({ name: "routes.events.moderation" })
  .use(updateStatusRoute)
  .use(updateAddressRoute);
