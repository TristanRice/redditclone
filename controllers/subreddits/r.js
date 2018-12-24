const express   = require("express")
	, Subreddit	= require("../../models/subreddit")
	, auth      = require("../middlewares/authentication/auth")
	, router    = express.Router( );

router.get("/:subreddit", (req, res) => {

	subreddit = req.params.subreddit;
	if (req.session && req.session.current_user)
	{current_user = req.current_user[0];}
	else
		current_user = false;
	current_sub_information = {is_admin: false}

	Subreddit.find({name: subreddit}, (err, Sub) => {
		
		if (err)
			throw err;
		
		if (!Sub.length)
			return res.render("errors/404", {
				message: `Sorry, the subreddit that you are looking
						  for cannot be found`
			});

		Sub = Sub[0];
		return res.render("subreddits/sub.pug", {
			title: Sub.name,
			subreddit: Sub
		});
	});
});

router.post("/:subreddit/make_post", auth.is_authenticated, (req, res) => {

})

module.exports = router;