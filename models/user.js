const mongoose   = require("mongoose")
	, uniq_valid = require("mongoose-unique-validator")
	, bcrypt     = require("bcrypt")
	, Post       = require("./post");

const userSchema = new mongoose.Schema({
	username: {type: String, required: true},
	email: {type: String, required: true},
	password: {type: String, required: true},
	name: {
		first: {type: String, required: false},
		last: {type: String, required: false}
	},
	admin: {type: Boolean, required: false, default: false},
	deleted: {type: Boolean, required: false, default: false},
	created_at: {type: Date},
	updated_at: {type: Date}
});

userSchema.methods.hash_password = function( ) {
	this.password = bcrypt.hashSync(this.password, 10);
}

userSchema.methods.password_verify = function(password) {
	return password === bcrypt.compareSync(password, this.password);
}

userSchema.pre("save", function(next) {
	//now we must set the date that it was created at
	let current_date = Date( );
	this.updated_at = current_date;
	//if this is a new user, then update created_at as well
	if (!this.created_at)
		this.created_at = current_date;
	next( );
});

const User = mongoose.model("User", userSchema);

module.exports = User;