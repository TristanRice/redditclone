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
	, router      =   express.Router( );

mongoose.connect(config.MongoURI);

router.get("/:subreddit", (req, res) => {

	subreddit = req.params.subreddit;

	Subreddit.find({name: subreddit}, (err, Sub) => {
		
		if (err)
			throw err;
		
		if (!Sub.length)
			return errors.error_404(req, res, "Subreddit");

		Sub = Sub[0]
		return res.render("subreddits/sub.pug", {
			title: Sub.name,
			subreddit: Sub
		});
	});
});

router.post("/:subreddit/make_post", auth.is_authenticated, (req, res) => {

	let subreddit    = req.params.subreddit;
	let current_user = req.session.current_user;
	
	let image        = req.files.imagefile;
	let image_json   = fileUpload.uploadFile(image);

	Subreddit.find({name: subreddit}, (err, subreddit) => {

		if (err)
			throw err;

		if (!Subreddit.length)
			return errors.error_404(req, res, "Subreddit");

		subreddit = subreddit[0];

		let post = new Post({
			title: req.body.title,
			text: req.body.text,
			User: [current_user],
			image: image_json
		})
		subreddit.posts.push(post);
		
		Subreddit.update({_id: subreddit._id} /*lol*/, subreddit, function(err, raw) {
			if (err)
				console.log(`An error occured: ${err}`);
			logger.logNewPost(subreddit, post, current_user, true);
		});
		
		res.render("subreddits/make_post/main")
	});
});

router.get("/:subreddit/make_post", auth.is_authenticated, (req, res) => {
	res.render("subreddits/make_post/main.pug", {
		title: "Make post"
	});
});

module.exports = router;