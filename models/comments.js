const mongoose = require("mongoose")
	, User 	   = require("./user")
	, Post     = require("./post");

const commentSchema = new mongoose.Schema({
	content: {type: String},
	metadata: {
		created_at: {type: Date},
		updated_at: {type: Date},
		banned: {type: Boolean, default: false},
		deleted: {type: Boolean, default: false},
		upvotes: {type: Number, default: 0},
		downvotes: {type: Number, default: 0}
	},
	platinums: {type: Number, default: 0},
	golds: {type: Number, default: 0},
	silvers: {type: Number, default: 0},
	uid: {type: String},
	//The way that this works is that it will default to no uid_for,
	//this means that a new comment will have no uid_for, but then 
	//replies to that will have the uid_for to the comment that they
	//are replying to.
	uid_for: {type: String, default: ""}
});
commentSchema.methods.gildComment = function(level) {
	switch(level) {
		case 1: ++this.silvers; break;
		case 2: ++this.golds; break;
		case 3: ++this.platinums; break;
		default:
			throw new Error("Wrong value entered");
	}
}

commentSchema.methods.vote = function(value) {
	if (value!==1 || value!==-1)
		return;
	this.upvotes+=value;
}

commentSchema.methods.shouldBeHidden = function(commentHideMin) {
	return (this.upvotes-this.downvotes) < commentHideMin;
}

const Comment = mongoose.model("Comments", commentSchema)

module.exports = Comment;