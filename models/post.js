const mongoose = require("mongoose")
	, Comment  = require("./comment");

const postSchema = new mongoose.schema({
	title: {type: String, required: true},
	text: {type: String, required: true},
	metadata: {
		likes: {type: Number, required: false, defualt: 0},
		dislikes: {type: Number, required: false, default: 0},
		//deleted and banned are 2 differnet things, because
		//something could get unbanned/undeleted
		deleted: {type: Boolean, default: false},
		banned: {type: Boolean, default: false},
		created_at: {type: Date},
		updated_at: {type: Date}
	}
	image: {
		is_image: {type: Boolean, default: false},
		//remember to try and get hte user to host the image off-site,
		//we don't want any of those whipper-snappers to use
		//up too much of our space
		is_local: {type: Boolean, default: false},
		image_url: {type: String},
	},
	comments: [Comment.schema]
});