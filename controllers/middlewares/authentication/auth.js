module.exports = {
	is_authenticated: (req, res, next) => {
		if (req.session && req.session.current_user)
			return next( );

		return res.redirect("/login");
	},

	not_authenticated: (req, res, next) => {
		if (!(req.session && req.session.current_user)) {
			return next( );
		}

		return res.redirect("/logout");
	}
}