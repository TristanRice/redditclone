const express = require("express")
	, u_roots = require("./u/u")
	, router  = express.Router( );

router.use("/u/", router);
module.exports = router;