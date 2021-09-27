const { Movie, validate } = require("../models/genre");
const { Genre } = require("../models/genre");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
	const movies = await Movie.find().sort("title");
	res.send(movies);
});

router.post("/", async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const genre = await Genre.findById(req.body.genreId);
	if (!genre) return res.status(400).send("Invalid genre");

	let movie = new Movie({
		title: req.body.title,
		genre: {
			_id: genre._id,
			name: genre.name,
		},
		numberInStock: req.body.numberInStock,
		dailyRentalRate: req.body.dailyRentalRate,
	});
	movie = await movie.save();

	res.send(movie);
});

router.put("/:id", async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const movie = await Movie.findByIdAndUpdate(
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

	if (!movie)
		return res.status(404).send("The movie with the given ID was not found.");

	res.send(movie);
});

router.delete("/:id", async (req, res) => {
	const movie = await Movie.findByIdAndRemove(req.params.id);

	if (!movie)
		return res.status(404).send("The movie with the given ID was not found.");

	res.send(movie);
});

router.get("/:id", async (req, res) => {
	const movie = await Movie.findById(req.params.id);

	if (!movie)
		return res.status(404).send("The movie with the given ID was not found.");

	res.send(movie);
});

async function createMovie(title, genre, numberInStock, dailyRentalRate) {
	const movie = new Movie({
		title,
		genre,
		numberInStock,
		dailyRentalRate,
	});

	const result = await movie.save();
	console.log(result);
}

async function listMovies() {
	const movies = await Movie.find()
		.populate("title")
		.populate("genre", "name")
		.select("title genre numberInStock");
	console.log(movies);
}

async function findMovieById(movieId) {
	const movie = await Movie.find(movieId);
	console.log(movie);
}
module.exports = router;
