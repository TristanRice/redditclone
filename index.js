const express  = require("express")
	, routes   = require("./controllers/index")
	, config   = require("./config")
	, parser   = require("body-parser")
	, mongoose = require("mongoose")
	, cookie   = require("cookie-parser")
	, session  = require("express-session");

const app = express( );

app.use(parser.urlencoded({
	extended: true
}));

app.use(parser.json());

app.set("view engine", "pug");
app.set("views", "./views");

app.use(cookie( ));
app.use(session({
	secret: "tH1s-1S-mY-s3Cr3T",
	resave: false,
	saveUninitialized: true
}));

app.use(express.static("./public"));
app.use(routes);

app.listen(config.port, ( ) => {
	console.log(`[*] Listening on port ${config.port}`)
});