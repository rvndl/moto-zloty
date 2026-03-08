import { t } from "elysia";

const NAME_LENGTH_MIN = 3;
const NAME_LENGTH_MAX = 32;
const CONTENT_LENGTH_MIN = 3;
const CONTENT_LENGTH_MAX = 1024;

export const ContactBody = t.Object({
  name: t.String({
    minLength: NAME_LENGTH_MIN,
    maxLength: NAME_LENGTH_MAX,
    description: "Sender's name",
  }),
  email: t.String({ format: "email", description: "Sender's email address" }),
  content: t.String({
    minLength: CONTENT_LENGTH_MIN,
    maxLength: CONTENT_LENGTH_MAX,
    description: "Message content",
  }),
  recaptcha: t.String({ description: "Turnstile captcha token" }),
});

export const ContactResponse = t.Object({
  message: t.String(),
});

export type ContactBodyType = typeof ContactBody.static;
