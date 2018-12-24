const express = require("express")
	, router  = express.Router( )
	, subs    = require("./subreddits/subreddit")
	, auth    = require("./auth/auth")
	, logging = require("./middlewares/logging/logging");

router.get("/", (req, res) => {
	res.render("index", {
		message: "Welcome to my reddit clone"
	});
});

router.use("/", subs);
router.use("/", auth);
router.use(logging.main);

module.exports = router;