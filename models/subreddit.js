const mongoose = require("mongoose")
	, User 	   = require("./user")
	, Comment  = require("./comment")
	, Post     = require("./post");

const subredditSchema = new mongoose.Schema({
	name: {type: String, unique: true, required: true},
	administrator: User.schema,
	metadata: {
		followers: {type: Number, required: false, default: 0},
		moderators: [User.schema],
		created_at: {type: Date},
		updated_at: {type: Date},
		banned_status:{
			banned: {type: Boolean, required: false, default: false},
			reason: {type: String, required: false, default: ""},
			//this could be useful to hold users accountable if they have
			//unfairly banned a subreddit
			user: [User.schema]
		},
		deleted_status: {
			deleted: {type: Boolean, required: false, default: false}	
		}
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
			icon: {type: String, required: false, default: ""},
			//the severity of the punishment of a rule. In the future, this will
			//be represented by an icon going from green to red. 
			severity: {type: Number, required: false, defualt: 1}
		}
	],
	//A subreddit having a certain amount of dislikes/likes is useful to show
	//a prospective user trying to find a new subreddit. If a subreddit is 
	//seen to be too contreversial, then the user can decide to not visit it. 
	likes: {type: Number, default: 0},
	dislikes: {type: Number, default: 0},
	//This is an icon used to show 
	icon: {type: String, default: ""},
	affiliated_subreddits: [
		{
			name: {type: String, default: ""},
			//The follower count should be shown below the subreddit name
			followers: {type: Number, default: ""},
			icon: {type: String, default: ""}
		}
	],
	is_new: {type: Boolean, default: true},
	posts: [Post.schema],
	//number at which comments will be hidden, this can be 
	//unique to each subreddit
	commentHideMin: {type: Number, default: -10}
});

subredditSchema.methods.addModerator = function(User) {
	this.metadata.moderators.push(User);
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

subredditSchema.methods.hasModerator = function(User) {
	return this.metadata.moderators.contains(User);
}

subredditSchema.methods.admin_is = function(User) {
	return this.administrator === User;
}

subredditSchema.methods.delete = function(reason) {
	//having a reason for a subreddit beign deleted could be useful 
	//for the admins of that subreddit to tell their users where to 
	//go next if they are still going to continue to give content
	this.metadata.deleted_status.deleted = true;
	this.metadata.deleted_status.reason  = reason;
}

subredditSchema.methods.makePost = function(post) {
	this.posts.push(post);
}

subredditSchema.methods.setUp = function(current_user) {
	current_date = Date( );
	console.log("here");
	if (this.is_new) { //make sure that it is a new subreddit
		//set up a new subreddit
		this.metadata.created_at = current_date;
		
		//this justs puts a new post on the subreddit.
		let comment = new Comment({
			text: "This is a comment",
			user: current_user
		});

		let post = new Post({
			title: "Welcome to your new subreddit",
			text: "Here you can create posts and images",
			comments: [comment],
			user: current_user
		});
		this.makePost(post);
		this.is_new = false;
	}
}

subredditSchema.pre("save", function(next) {
	next();
});

const Subreddit = mongoose.model("Subreddit", subredditSchema);

module.exports = Subreddit;