const express  = require("express")
	, router   = express.Router( )
	, User     = require("../../models/user.js")
	, mongoose = require("mongoose")
	, config   = require("../../config")
	, session  = require("express-session");

mongoose.connect(config.MongoURI);
const { check, validationResult } = require('express-validator/check');
const { body } = require("express-validator/check");


router.get("/register", (req, res) => {
	res.render("register");
});

router.post("/register", [
	
	check("username")
		.isLength({min: 5, max: 15})
		.withMessage("Your username must be between 5 and 15 characters")
		.escape( ).trim( ),

	check("email")
		.isEmail( )
		.withMessage("Please enter a valid email")
		.trim( ).escape( ),
	
	body("firstname")
		.custom((value, {req}) => {
			if (value && !(value.length>2 && value.length<20))
				throw new Error("Your First name must be between 5 and 20 characters")
			return true;
		}).trim( ).escape( ),
	
	body("surname")
		.custom((value, {req}) => {
			if (value && !(value.length>2 && value.length<20))
				throw new Error("Your surname must be between 5 and 20 characters")
			return true;
		}).trim( ).escape( ),
	
	body("password1")
		.isLength({min: 10, max:99})
		.withMessage("Your password must be more than 10 characters")
		.custom((value, {req}) => {
			if (value!==req.body.password2)
				throw new Error("Passwords must match");
			return true;
		})
],
(req, res) => {
	let errors = validationResult(req);
	
	console.log(errors.array( ))
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
	User.find({username: req.body.username}, (err, user) => {
		if (err)
			throw err;
		
		if (user.password_verify(req.body.password)){
			//If the user has entered correct credentials, give
			//them a session and redirect them back to the main page
			req.session.current_user = user;
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