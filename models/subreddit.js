const mongoose = require("mongoose")
	, User 	   = require("./user")
	, Post     = require("./post");

const subredditSchema = new mongoose.schema({
	name: {type: String, unique: true, required: true},
	metadata: {
		followers: {type: Number, required: false, default: 0},
		administrator: {type: String, required: true},
		moderators: [User.schema],
		created_at: {type: Date},
		updated_at: {type: Date},
		banned: {type: Boolean, required: false, default: false},
		deleted: {type: Boolean, required: false, default: false}
	},
	//a brief description that the moderators/admin of a subreddit can give to 
	//new users, as a sort of first impression.
	description: {type: String},
	//If people see that they are online with multiple other people, then it
	//promotes a sense of community, making them more likely to come back.
	currently_online: {type: Number},
	//this can be useful for ranking subreddits based off more than subscribers alone
	views: {type: Number},
	//this is the banner that is shown on the top of the subreddit
	banner: {type: String},
	rules: [
		{
			rule_title: {type: String},
			rule_description: {type: String},
			//having upvotes and downvotes on a rule will allow the administrator
			//and moderators to see how well the rule is going down within the users.
			//This can help them improve the subreddit, by keeping rules that are 
			//well liked, and takign away rules that get alot of dislikes
			likes: {type: Number, required: false, default: 0},
			dislikes: {type: Number, required: false, default: 0},
			//why not have an icon lmao.
			icon: {type: String, required: false},
			//the severity of the punishment of a rule. In the future, this will
			//be represented by an icon going from green to red. 
			severity: {type: Number, required: false, defualt: 1}
		}
	],
	//A subreddit having a certain amount of dislikes/likes is useful to show
	//a prospective user trying to find a new subreddit. If a subreddit is 
	//seen to be too contreversial, then the user can decide to not visit it. 
	likes: {type: Number},
	dislikes: {type: Number},
	//This is an icon used to show 
	icon: {type: String},
	affiliated_subreddits: [
		{
			name: {type: String},
			//The follower count should be shown below the subreddit name
			followers: {type: Number},
			icon: {type: String}
		}
	],
	new: {type: Boolean, default: false},
	posts: [Post.schema],
	//number at which comments will be hidden, this can be 
	//unique to each subreddit
	commentHideMin: {type: Number, default: -10}
});

subredditSchema.methods.addModerator = function(username) {
	this.metadata.moderators.push({
		user: {
			"username": username
		}
	});
}

subredditSchema.methods.addRule = function(rule_title, rule_description) {
	this.rules.push({
		"rule_title": rule_title,
		"rule_description": rule_description
	});
}

subredditSchema.methods.calculateLikesAndDislikes = function(callback) {
	return callback(this.likes-this.dislikes);
}

subredditSchema.pre("save", function(next) {
	current_date = Date( );
	if (this.new) {
		//set up a new subreddit
		this.metadata.created_at = current_date;
	}
	this.metadata.updated_at = current_date;
})

const Subreddit = mongoose.model("Subreddit", subredditSchema);

module.exports = Subreddit;