class Constants {
	//the minimum length for everything shuold be the sam

	constructor( ) {
		this.AVG_MIN_LEN = 3;
		/*
		* Constants for subreddit posts
		*/

		//title of the post
		this.POST_TITLE_MIN_LENGTH = this.AVG_MIN_LEN;
		this.POST_TITLE_MAX_LENGTH = 20;

		//content of the post
		this.POST_CONTENT_MIN_LENGTH = this.AVG_MIN_LEN;
		this.POST_CONTENT_MAX_LENGTH = 150;

		/*
		* Constatns for the actual subreddit
		*/

		//subreddit name
		this.SUBREDDIT_NAME_MIN_LENGTH = this.AVG_MIN_LEN;
		this.SUBREDDIT_NAME_MAX_LENGTH = 20;

		//subreddit description
		this.SUBREDDIT_DESCRIPTION_MIN_LENGTH = this.AVG_MIN_LEN;
		this.SUBREDDIT_DESCRIPTION_MAX_LENGTH = 120;

		//vital strings for subreddits
		this.SUBREDDIT_PREFIX_STRING = "/r/";
		
		/*
		* User constants
		*/

		//First name
		this.USER_FIRSTNAME_MIN_LENGTH = this.AVG_MIN_LEN;
		this.USER_FIRSTNAME_MAX_LENGTH = 20;

		//Last name
		this.USER_LASTNAME_MIN_LENGTH = this.AVG_MIN_LEN;
		this.USER_LASTNAME_MAX_LENGTH = 20;

		//username
		this.USER_USERNAME_MIN_LENGTH = this.AVG_MIN_LEN;
		this.USER_USERNAME_MAX_LENGTH = 30;

		//password
		this.USER_PASSWORD_MIN_LENGTH = 10;
		this.USER_PASSWORD_MAX_LENGTH = 99;
		this.USER_PASSWORD_REGX_MATCH = "Do this later";
	}
}
console.log(new Constants( ));
module.exports = new Constants( );