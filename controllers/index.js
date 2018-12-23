const express = require("express")
	, router  = express.Router( )
	, subs    = require("./subreddits/r")
	, auth    = require("./auth/auth");

router.get("/", (req, res) => {
	res.render("index", {
		message: "Welcome to my reddit clone"
	});
});

router.use("/r/", subs);
router.use("/", auth);

module.exports = router;