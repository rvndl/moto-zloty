import pino from "pino";
import PinoPretty from "pino-pretty";

const stream = PinoPretty({
  colorize: true,
  translateTime: "yyyy-mm-dd HH:MM:ss",
  ignore: "pid,hostname,module",
  messageFormat: (log, messageKey) => {
    const module = log.module ? `${log.module}: ` : "";
    return `${module}${log[messageKey]}`;
  },
});

const baseLogger = pino(
  {
    level: process.env.LOG_LEVEL || "info",
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  stream,
);

const createLogger = (module: string) => {
  return {
    info: (...args: any[]) => baseLogger.info({ module }, ...args),
    warn: (...args: any[]) => baseLogger.warn({ module }, ...args),
    error: (...args: any[]) => baseLogger.error({ module }, ...args),
    debug: (...args: any[]) => baseLogger.debug({ module }, ...args),
  };
};

export { createLogger };
