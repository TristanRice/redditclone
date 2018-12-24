const express   = require("express")
	, db 	    = require("../../util/db")
	, Subreddit = require("../../models/subreddit")
	, helpers   = require("../helpers/helper")
	, Post      = require("../../models/post")
	, Comment   = require("../../models/comment")
	, subroutes = require("./r")
	, config    = require("../../config")
	, mongoose  = require("mongoose")
	, router    = express.Router( );

mongoose.connect(config.MongoURI);

router.get("/create", helpers.is_authenticated, (req, res) => {
	res.render("subreddits/create", {
		title: "aaa",
		current_user: req.session.current_user
	});
});

router.post("/create", helpers.is_authenticated, (req, res) => {
	current_user = req.session.current_user[0];

	let subreddit = new Subreddit({
		name: req.body.name,
		administrator: current_user,
		description: req.body.description,
	});
	subreddit.setUp(current_user);

	subreddit.save((err) => {
		if (err)
			throw err;

		console.log("Subreddit added");
	})

	return res.render("subreddits/create");
});

router.use("/r/", subroutes);
module.exports = router;