module.exports = {
	main: (req, res, next) => {
		console.log(`Incoming ${req.method} request for ${req.url}`);
	},

	logNewPost: (Subreddit, Post, User, logPost=false) => {
		console.log(`${User.username} made new post on subreddit ${Subreddit.name} entitled: ${Post.title}`);
		if (logPost)
			console.log(Subreddit);
	}
}