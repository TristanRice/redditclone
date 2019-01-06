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
	},

	already_exists: (req, res, item) => {
		return res.render("errors/already_exists", {
			message: `Sorry, this ${item} already exists`
		});
	},

	error_messages: {
		subNameLength: "Suberddit name must be between 3 and 20 chracters long",
		subDescLength: "Subreddit description must be between 10 and 200 characters",
		surnameLength: "Your surname must be between 2 and 20 characters",
		firstnameLength: "Your first name must be between 2 and 20 characters"
	}
}