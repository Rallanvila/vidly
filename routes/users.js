// const { Rental, validate } = require("../models/rental");
const { User, validate } = require("../models/user");
// const { Movie } = require("../models/movie");
// const { Customer } = require("../models/customer");
const mongoose = require("mongoose");
const Fawn = require("fawn");
const express = require("express");
const router = express.Router();

Fawn.init(mongoose);

router.get("/", async (req, res) => {
	const users = await User.find().sort("name");
	res.send(users);
});

router.post("/", async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const user = await User.findById(req.body.userId);
	if (!user) return res.status(400).send("Invalid user.");

	let user = new User({
		customer: {
			_id: customer._id,
			name: customer.name,
			email: customer.phone,
			password: customer.password,
		},
	});

	let result = user.save();
	console.log(result);
	//   try {
	//     new Fawn.Task()
	//       .save('rentals', rental)
	//       .update('movies', { _id: movie._id }, {
	//         $inc: { numberInStock: -1 }
	//       })
	//       .run();

	//     res.send(rental);
	//   }
	//   catch(ex) {
	//     res.status(500).send('Something failed.');
	//   }
});

router.get("/:id", async (req, res) => {
	const user = await User.findById(req.params.id);

	if (!user)
		return res.status(404).send("The user with the given ID was not found.");

	res.send(user);
});

module.exports = router;
