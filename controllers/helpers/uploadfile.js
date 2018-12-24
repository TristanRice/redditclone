const path     =   require("path")
	, uuid     =   require('uuid/v1')
	, config   =   require("../../config")
	, errors   =   require("../helpers/errors");

module.exports = {
	allowedPathNames: [
		".gif",
		".png",
		".jpg"
	],

	returnSafeFile: function(filename) {
		pathname = path.extname(filename);
		if (!(this.allowedPathNames.indexOf(pathname) > -1))
			//Don't allow them to upload any non-image files
			return false;

		filename = uuid( ) + pathname;

		return filename;
	},

	uploadFile: function(image, req, res) {
		if (image) {
			name = this.returnSafeFile(image.name);
			if (!name)
				return errors.error_500(req, res, "post")
			image.mv(`${__dirname}/../..${config.upload_destination}${name}`);
			return {
				is_image: true,
				is_local: true,
				image_url: config.upload_destination+name
			};
		}
		return {
			is_image: false,
			is_local: false,
			image_url: ""
		};
	}
}