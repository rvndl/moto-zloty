import { Elysia } from "elysia";
import { verifyTurnstile } from "../lib/turnstile";
import { ContactBody, ContactResponse } from "../models/contact";
import { ErrorResponse } from "../models/common";

export const contactRoute = new Elysia({
  name: "routes.contact",
  prefix: "/contact",
})
  .model({
    "contact.body": ContactBody,
    "contact.response": ContactResponse,
    "common.error": ErrorResponse,
  })
  .post(
    "/",
    async ({ body, status }) => {
      const { name, email, content, recaptcha } = body;

      const isValid = await verifyTurnstile(recaptcha);
      if (!isValid) {
        return status(400, { error: "Weryfikacja Turnstile nie powiodła się" });
      }

      const smtpLogin = Bun.env.SMTP_LOGIN;
      const smtpPass = Bun.env.SMTP_PASS;

      if (!smtpLogin || !smtpPass) {
        console.error("SMTP credentials not configured");
        return status(500, {
          error: "Wystąpił błąd podczas wysyłania wiadomości",
        });
      }

      try {
        const nodemailer = await import("nodemailer");

        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: smtpLogin,
            pass: smtpPass,
          },
        });

        await transporter.sendMail({
          from: `${name} <${email}>`,
          to: smtpLogin,
          subject: "Moto-Zloty - Kontakt",
          text: `Od:\n${name} (${email})\n\nTreść:\n${content}`,
        });

        return { message: "ok" };
      } catch (error) {
        console.error("Failed to send email:", error);

        return status(500, {
          error: "Wystąpił błąd podczas wysyłania wiadomości",
        });
      }
    },
    {
      body: "contact.body",
      response: {
        200: "contact.response",
        400: "common.error",
        500: "common.error",
      },
      detail: {
        summary: "Submit contact form",
        tags: ["Contact"],
      },
    },
  );
