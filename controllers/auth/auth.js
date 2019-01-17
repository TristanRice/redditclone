const express   = require("express")
	, User      = require("../../models/user.js")
	, mongoose  = require("mongoose")
	, config    = require("../../config")
	, session   = require("express-session")
	, bcrypt    = require("bcrypt")
	, errores   = require("../helpers/errors")
	, url_for   = require("../helpers/url_for")
	, constants = require("../helpers/constants")
	, router    = express.Router( );

mongoose.connect(config.MongoURI);
const { check, validationResult } = require('express-validator/check');
const { body } = require("express-validator/check");


router.get(url_for.register, (req, res) => {
	res.render("register");
});

router.post(url_for.register, [
	
	check("username")
		.isLength({min: constants.USER_USERNAME_MIN_LENGTH, max: constants.USER_USERNAME_MAX_LENGTH})
		.withMessage(errores.error_messages.MESSAGE_USERNAME_WRONG_LENGTH)
		.escape( ).trim( ),

	check("email")
		.isEmail( )
		.withMessage("Please enter a valid email")
		.trim( ).escape( ),
	
	body("firstname")
		.isLength({min: constants.USER_FIRSTNAME_MIN_LENGTH, max: constants.USER_FIRSTNAME_MAX_LENGTH})
		.withMessage(errores.error_messages.MESSAGE_USER_FIRSTNAME_WRONG_LENGTH)
		.trim( ).escape( ),
	
	body("surname")
		.isLength({min: constants.USER_SURNAME_MIN_LENGTH, max: constants.USER_SURNAME_MAX_LENGTH})
		.withMessage(errores.error_messages.surnameLength)
		.trim( ).escape( ),
	
	body("password1")
		.isLength({min: constants.USER_PASSWORD_MIN_LENGTH, max: constants.USER_PASSWORD_MAX_LENGTH})
		.withMessage(errores.passwords.PASSWORD_WRONG_LENGTH)
		.custom((value, {req}) => {

			if (value!==req.body.password2)
				throw new Error(constants.passwords.PASSWORD_NOT_MATCH);
			
			else if (false)
				throw new Error(constants.passwords.MEET_PASSWORD_REQUIREMENTS)	
			return true;
		})
],
(req, res) => {
	let errors = validationResult(req);
	
	console.log(errors.array( ));
	if (!errors.isEmpty( )) {
		return res.render("register", {
			"errors": errors.array( )
		});
	}

	//Create the user model
	let user = new User({
		username: req.body.username,
		email: req.body.email,
		password: req.body.password1,
		name: {
			first: req.body.firstname,
			last: req.body.surname
		}
	});
	//hash the password before saving the user to the database
	user.hash_password( );

	user.save((err) => {
		if (err)
			//Ik this is bad, but I'm retarded so...
			return res.render("register", {
				"errors": "That email/username is already in use"
			});
		console.log("User added");
	})

	req.session.current_user = user;
	req.session.save( );

	res.redirect("/");
});

router.get(url_for.login, (req, res) => {
	res.render("login");
});

router.post(url_for.login, (req, res) => {
	User.find({username: req.body.username}, (err, User) => {

		if (err)
			throw err;

		//If there is no user found then we should just say that
		//They have entered the wrong username or password
		if (!User.length) 
			return res.render("login", {
				error: errores.error_messages.WRONG_CREDENTIALS
			});

		if (bcrypt.compareSync(req.body.password2, User[0].password)) {
			//If the user has entered correct credentials, give
			//them a session and redirect them back to the main page
			req.session.current_user = User;
			req.session.save( );

			return res.redirect("/");
		}

		return res.render("login", {
			error: errores.error_messages.WRONG_CREDENTIALS
		});
	});
});

router.get(url_for.logout, (req, res) => {
	req.session.destroy( );
	res.redirect("/");
});

module.exports = router;