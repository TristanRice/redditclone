const express   =   require("express")
	, db 	    =   require("../../util/db")
	, Subreddit =   require("../../models/subreddit")
	, authent   =   require("../middlewares/authentication/auth")
	, Post      =   require("../../models/post")
	, Comment   =   require("../../models/comments")
	, subroutes =   require("./r")
	, config    =   require("../../config")
	, mongoose  =   require("mongoose")
	, errors    =   require("../helpers/errors")
	, router    =   express.Router( )
	, {
		check,
		validationResult,
		body
	}		    = require("express-validator/check");

mongoose.connect(config.MongoURI);

router.get("/create", authent.is_authenticated, (req, res) => {
	res.render("subreddits/create", {
		title: "aaa",
		current_user: req.session.current_user
	});
});

router.post("/create", authent.is_authenticated, [

	check("name")
		.isLength({min: 3, max: 20})
		.withMessage(errors.error_messages.subNameLength)
		.escape( ).trim( )
		.custom((value, {req}) => {

		}),

	check("description")
		.isLength({min:10, max:200})
		.withMessage(errors.error_messages.subDescLength)
		.escape( ).trim( )

],
(req, res) => {
	let current_user = req.session.current_user[0];
	let errors = validationresult(req);
	//console.log(errors.array( ));

	let subreddit = new Subreddit({
		name: req.body.name,
		administrator: current_user,
		description: req.body.description,
	});
	
	let subreddits = Subreddit.findOne({"name":req.body.name}, "name", function(err, subreddit) {
		if (err)
			throw err;

		if (subreddit)
			return errors.already_exists(req, res, "subreddit");
	});

	subreddit.save((err) => {
		if (err)
			throw err

		return res.redirect(`/r/${req.body.name}`);
	});
});

router.use("/r/", subroutes);
module.exports = router;