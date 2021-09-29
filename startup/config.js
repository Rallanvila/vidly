const config = require("config");

module.exports = function () {
	if (!config.get("jwtPrivateKey")) {
		console.log(process.env);
		throw new Error("FATAL ERROR: jwtPrivateKey is not defined.");
	}
};
