const winston = require("winston");
const config = require("config");
require("winston-mongodb");
require("express-async-errors");

module.exports = function () {
	//! Mosh's Example of Winston
	// winston.exceptions.handle(
	// 	new winston.transports.Console({ colorize: true, prettyPrint: true }),
	// 	new winston.transports.File({ filename: "uncaughtExceptions.log" }),
	// );

	// process.on("unhandledRejection", (ex) => {
	// 	throw ex;
	// });

	// winston.add(winston.transports.File, { filename: "logfile.log" });
	// winston.add(winston.transports.MongoDB, {
	// 	db: "mongodb://localhost/vidly",
	// 	level: "info",
	// });

	const logger = winston.createLogger({
		level: "info",
		format: winston.format.json(),
		defaultMeta: { service: "user-service" },
		transports: [
			//
			// - Write all logs with level `error` and below to `error.log`
			// - Write all logs with level `info` and below to `combined.log`
			//
			new winston.transports.File({ filename: "error.log", level: "error" }),
			new winston.transports.File({ filename: "combined.log" }),
		],
	});

	//
	// If we're not in production then log to the `console` with the format:
	// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
	//
	if (process.env.NODE_ENV !== "production") {
		logger.add(
			new winston.transports.Console({
				format: winston.format.simple(),
			}),
		);
	}

	if (!config.get("jwtPrivateKey")) {
		console.error("FATAL ERROR: jwtPrivateKey is not defined");
		process.exit(1);
	}
};
