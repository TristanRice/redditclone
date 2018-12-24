const express = require("express")
	, router  = express.Router( )

router.use((req, res, next) => {
	console.log(`Date: ${Date.now()}`);
	console.log(`Method: ${req.method}`);		
})