const express   = require("express")
	, router    = express.Router( )
	, User      = require("../../models/user.js")
	, mongoose  = require("mongoose")
	, config    = require("../../config")
	, session   = require("express-session")
	, bcrypt    = require("bcrypt")
	, errores   = require("../helpers/errors")
	, constants = require("../helpers/constants");

mongoose.connect(config.MongoURI);
const { check, validationResult } = require('express-validator/check');
const { body } = require("express-validator/check");


router.get("/register", (req, res) => {
	res.render("register");
});

router.post("/register", [
	
	check("username")
		.isLength({min: constants.USERNAME_MIN_LENGTH, max: constants.USERNAME_MAX_LENGTH})
		.withMessage(errores.error_messages.MESSAGE_USERNAME_WRONG_LENGTH)
		.escape( ).trim( ),

	check("email")
		.isEmail( )
		.withMessage("Please enter a valid email")
		.trim( ).escape( ),
	
	body("firstname")
		.isLength({min: 2, max: 20})
		.withMessage(errores.error_messages.MESSAGE_USER_FIRSTNAME_WRONG_LENGTH)
		.trim( ).escape( ),
	
	body("surname")
		.isLength({min: 2, max:20})
		.withMessage(errores.error_messages.surnameLength)
		.trim( ).escape( ),
	
	body("password1")
		.isLength({min: 10, max:99})
		.withMessage("Your password must be more than 10 characters")
		.custom((value, {req}) => {
			if (value!==req.body.password2)
				throw new Error("Passwords must match");
			return true;
		})
		.custom((value, {req}) => {
			//Check that it mathces the regex here
			if (false)
				throw new Error("You")
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

router.get("/login", (req, res) => {
	res.render("login");
});

router.post("/login", (req, res) => {
	User.find({username: req.body.username}, (err, User) => {

		if (err)
			throw err;

		//If there is no user found then we should just say that
		//They have entered the wrong username or password
		if (!User.length) 
			return res.render("login", {
				error: "Wrong username and/or password"
			});

		if (bcrypt.compareSync(req.body.password2, User[0].password)) {
			//If the user has entered correct credentials, give
			//them a session and redirect them back to the main page
			req.session.current_user = User;
			req.session.save( );

			return res.redirect("/");
		}

		return res.render("login", {
			error: "Wrong username and/or password"
		});
	});
});

router.get("/logout", (req, res) => {
	req.session.destroy( );
	res.redirect("/");
});

module.exports = router;