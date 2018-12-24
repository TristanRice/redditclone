const express = require("express")
	, router  = express.Router( )
	, subs    = require("./subreddits/subreddit")
	, auth    = require("./auth/auth")
	, logging = require("./middlewares/logging/logging")
	, errors  = require("./helpers/errors");

router.get("/", (req, res) => {
	res.render("index", {
		message: "Welcome to my reddit clone"
	});
});

router.use("/", subs);
router.use("/", auth);
router.use(logging.main);

router.get("*", errors.error_404);
router.post("*", errors.error_404);

module.exports = router;