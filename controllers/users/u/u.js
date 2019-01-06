const express   = require("express")
	, auth 	    = require("../../middlewares/authentication/specific_user")
	, errors    = require("../../helpers/errors")
	, mongooose = require("mongoose")
	, User      = require("../../../models/user")
	, router    = express.Router( );

router.get(":username/post", auth.is_specific_user, (req, res) => {
	current_user = req.session.current_user[0];
	
});

router.post(":username/post", auth.is_specific_user, (req, res) => {
	current_user = req.session.current_user[0];

});

router.get(":username", (req, res) => {
	User.find({username: req.params.username}, (err, User) => {

		if (err)
			throw err;

		if (!User.length)
			return errors.error_404(req, res, "user");

		console.log(User.posts);
		if (!User)
			if (!)
	})
})
module.exports = router;