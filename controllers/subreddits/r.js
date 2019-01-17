const express     =   require("express")
	, Subreddit   =   require("../../models/subreddit")
	, Post        =   require("../../models/post")
	, auth        =   require("../middlewares/authentication/auth")
	, errors      =   require("../helpers/errors")
	, uploader    =   require("../helpers/uploadfile")
	, logger      =   require("../middlewares/logging/logging")
	, mongoose    =   require("mongoose")
	, fileUpload  =   require("express-fileupload")
	, config 	  =   require("../../config")
	, constants   =	  require("../helpers/constants")
	, {
		check,
		validationResult,
		body
	}		      = require("express-validator/check")
	, router      =   express.Router( );


mongoose.connect(config.MongoURI);

router.get("/:subreddit", (req, res) => {

	//first get the subreddit name from the request parameter
	subreddit = req.params.subreddit;

	Subreddit.find({name: subreddit}, (err, Sub) => {
		
		if (err)
			throw err;
		
		//if no subreddit with this name exists, give them a 404 error		
		if (!Sub.length)
			return errors.error_404(req, res, "Subreddit");

		//now we render the actual subeddit page.
		Sub = Sub[0]
		return res.render("subreddits/sub.pug", {
			title: Sub.name,
			subreddit: Sub
		});
	});
});

router.post("/:subreddit/make_post", auth.is_authenticated, [

	/*
	* The only necessary checks for these right now are length chceks, some more checks may be
	* needed later on, such as censorship checks. 
	*/
	check("title")
		.isLength({min: constants.POST_TITLE_MIN_LENGTH, max: constants.POST_TITLE_MAX_LENGTH})
		.withMessage(errors.error_messages.MESSAGE_POST_WRONG_TITLE_LENGTH)
		.escape( ).trim( ),

	check("text")
		.isLength({min: constants.POST_CONTENT_MIN_LENGTH, max:constants.POST_CONTENT_MAX_LENGTH})
		.withMessage(errors.error_messages.MESSAGE_CONTENT_WRONG_TITLE_LENGTH)
		.escape( ).trim( )

],
(req, res) => {

	let subreddit    = req.params.subreddit;
	let current_user = req.session.current_user;
	
	let image        = req.files.imagefile;
	let image_json   = fileUpload.uploadFile(image);

	/*
	* In order to actually make a post on the subreddit, we first
	* must get the subreddit that the user is trying to make the 
	* post on
	*/
	Subreddit.find({name: subreddit}, (err, subreddit) => {

		if (err)
			throw err;

		if (!subreddit.length)
			return errors.error_404(req, res, "Subreddit");

		//mongoose returns this as a list, so after checking that it exists, we get the subreddit object from the first index of the list
		subreddit = subreddit[0];

		//make a new object from the schema, and push it to the subreddit object that we already have.
		let post = new Post({
			title: req.body.title,
			text: req.body.text,
			User: [current_user],
			image: image_json
		})
		subreddit.posts.push(post);
		
		//This gets teh same ID from the subreddit objec that we are using, and updates it with the new post in the database
		Subreddit.update({_id: subreddit._id}, subreddit, function(err, raw) {
			
			if (err)
				console.log(`An error occured: ${err}`);

			logger.logNewPost(subreddit, post, current_user, true);
		});
		
		return res.render("subreddits/make_post/main")
	});
});

router.get("/:subreddit/make_post", auth.is_authenticated, (req, res) => {
	res.render("subreddits/make_post/main.pug", {
		title: "Make post"
	});
});

module.exports = router;