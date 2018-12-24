module.exports = {
	error_404: (req, res, item) => {
		return res.render("errors/404", {
			message: `Sorry, we could not find the ${item} that
					  you are looking for`
		});
	},

	error_403: (req, res, item) => {
		return res.render("errors/403", {
			message: `Sorry, you are not allowed to access ${item}`
		});
	},

	error_500: (req, res, item) => {
		return res.render("errors/500", {
			message: `Sorry, there was an error while trying
					  to access ${item}, please try again later`
		});
	}
}