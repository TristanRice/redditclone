module.exports = {
	main: (req, res, next) => {
		console.log(`Incoming ${req.method} request for ${req.url}`);
		if (req.body)
			console.log(`Post data: ${req.body}`)
	}
}