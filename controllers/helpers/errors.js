const Constants = require("./constants");

class Errors {

	make_length_error_messages(item, subitem, min, max) {
		return `${item} ${subitem} must be between ${min} and ${max} characters long`;
	}

	constructor( ) {
		this.error_404 = (req, res, item) => {
			return res.render("errors/404", {
				message: `Sorry, we could not find the ${item} that you are looking for`
			});
		}

		this.error_403 = (req, res, item) => {
			return res.render("errors/403", {
				message: `Sorry, you are not allowed to access ${item}`
			});
		}

		this.error_500 = (req, res, item) => {
			return res.render("errors/500", {
				message: `Sorry, there was an error while trying
						  to access ${item}, please try again later`
			});
		}
		this.already_exists = (req, res, item) => {
			return res.render("errors/already_exists", {
				message: `Sorry, this ${item} already exists`
			});
		},
		this.error_messages =  {
			MESSAGE_SUBREDDIT_NAME_WRONG_LENGTH: 
				this.make_length_error_messages("Subreddit", "name", Constants.SUBREDDIT_NAME_MIN_LENGTH,
																	 Constants.SUBREDDIT_NAME_MAX_LENGTH),

			MESSAGE_SUBREDDIT_DESC_WRONG_LENGTH: 
				this.make_length_error_messages("Subreddit", "description", Constants.SUBREDDIT_DESCRIPTION_MIN_LENGTH, 
																		    Constants.SUBREDDIT_DESCRIPTION_MAX_LENGTH),

			MESSAGE_USER_SURNAME_WRONG_LENGTH: 
				this.make_length_error_messages("Your", "surname", Constants.USER_SURNAME_MIN_LENGTH, 
															       Constants.USER_SURNAME_MAX_LENGTH),

			MESSAGE_USER_FIRSTNAME_WRONG_LENGTH: 
				this.make_length_error_messages("Your", "first name", Constants.USER_FIRSTNAME_MIN_LENGTH, 
																      Constants.USER_FIRSTNAME_MAX_LENGTH),

			MESSAGE_USERNAME_WRONG_LENGTH: 
				this.make_length_error_messages("Your", "username", Constants.USER_USERNAME_MIN_LENGTH, 
															   	    Constants.USER_USERNAME_MAX_LENGTH),

			MESSAGE_POST_WRONG_TITLE_LENGTH:
				this.make_length_error_messages("Title", "length", Constants.POST_TITLE_MIN_LENGTH,
																   Constants.POST_TITLE_MAX_LENGTH),

			CONTENT_POST_LENGTH:
				this.make_length_error_messages("Content", "length", Constants.POST_CONTENT_MIN_LENGTH,
																	 Constants.POST_CONTENT_MAX_LENGTH),

			passwords: {
				PASSWORD_WRONG_LENGTH:
					this.make_length_error_messages("Your", "password", Constants.USER_PASSWORD_MIN_LENGTH,
																		Constants.USER_PASSWORD_MAX_LENGTH),

				PASSWORD_NOT_MATCH: "Passwords must match",
				MEET_PASSWORD_REQUIREMENTS: "Password must contain a symbol, a number, and a capital number"
			},

			WRONG_CREDENTIALS: "Wrong username and/or password"
		}
	}
}

module.exports = new Errors( );

console.log(new Errors( ))

console.log(Errors);