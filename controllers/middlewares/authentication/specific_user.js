errors = require("../../helpers/errors");

module.exports = {
	is_specific_user: (req, res, next) => {
		if (req.session && req.session.current_user &&
			req.session.current_user[0].username == req.params.username) {
			return next( );
		}
		
		return errors.error_403(req, res, "user"); 
	}
}