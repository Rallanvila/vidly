const { Rental, validate } = require("../models/rental");
const { Movie } = require("../models/genre");
const { Customer } = require("../models/customer");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
	const rentals = await Rental.find().sort("-dateOut");
	res.send(rentals);
});

router.post("/", async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const customer = await Customer.findById(req.body.customerId);
	if (!customer) return res.status(400).send("Invalid customer");

	const movie = await Movie.findById(req.body.movieId);
	if (!movie) return res.status(400).send("Invalid movie");

	if (movie.numberInStock === 0)
		return res.status(400).send("Movie is not in stock at the moment.");

	let rental = new Rental({
		customer: {
			_id: customer._id,
			name: customer.name,
			phone: customer.phone,
		},
		movie: {
			_id: movie._id,
			title: movie.title,
			dailyRentalRate: movie.dailyRentalRate,
		},
	});
	rental = await rental.save();

	movie.numberInStock--;
	movie.save();
	res.send(rental);
});

router.put("/:id", async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const rental = await Rental.findByIdAndUpdate(
		req.params.id,
		{
			title: req.body.title,
			genre: req.body.genre,
			numberInStock: req.body.numberInStock,
			dailyRentalRate: req.body.dailyRentalRate,
		},
		{
			new: true,
		},
	);

	if (!rental)
		return res.status(404).send("The rental with the given ID was not found.");

	res.send(rental);
});

router.delete("/:id", async (req, res) => {
	const rental = await Rental.findByIdAndRemove(req.params.id);

	if (!rental)
		return res.status(404).send("The rental with the given ID was not found.");

	res.send(rental);
});

router.get("/:id", async (req, res) => {
	const rental = await Rental.findById(req.params.id);

	if (!rental)
		return res.status(404).send("The rental with the given ID was not found.");

	res.send(rental);
});

async function createRental(title, genre, numberInStock, dailyRentalRate) {
	const rental = new Rental({
		title,
		genre,
		numberInStock,
		dailyRentalRate,
	});

	const result = await rental.save();
	console.log(result);
}

async function listRental() {
	const rentals = await Rental.find()
		.populate("title")
		.populate("genre", "name")
		.select("title genre numberInStock");
	console.log(rentals);
}

async function findRentalById(rentalId) {
	const rental = await Rental.find(rentalId);
	console.log(rental);
}
module.exports = router;
