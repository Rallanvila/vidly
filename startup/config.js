module.exports = function () {
	if (!config.get("jwtPrivateKey")) {
		console.log(process.env);
		console.error("FATAL ERROR: jwtPrivateKey is not defined.");
		process.exit(1);
	}
};
