import { pinoHttp } from "pino-http";

export const logger = pinoHttp({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
  customLogLevel: function (_, res) {
    if (res.statusCode >= 500) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
  customSuccessMessage: function (req, res) {
    return `Request ${req.url} completed with status ${res.statusCode}`;
  },
});
