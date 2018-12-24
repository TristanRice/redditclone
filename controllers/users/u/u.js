const express = require("express")
	, auth 	  = require("../../middlewares/authentication/specific_user")
	, errors  = require("../../helpers/errors")
	, router  = express.Router( );

router.get(":username/post", auth.is_specific_user, (req, res) => {
	current_user = req.session.current_user[0];
	
});

router.post(":username/post", auth.is_specific_user, (req, res) => {
	current_user = req.session.current_user[0];

});

router.get(":username", (req, res) => {
	
})
module.exports = router;