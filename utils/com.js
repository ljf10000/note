// com.js
// common of mp & gw

const db = require('db.js').db;
const api = require('api.js').api;

const com = {
	start_post: (app, param = {}) => {
		db.user.save(app.user);

		api.hideLoadingEx();

		if (param.opengid) {
			let url = `/pages/guide/guide?opengid=${param.opengid}`;

			if (param.gid) {
				url = `${url}?gid=${param.gid}`;
			}

			console.log(`start over redirectTo ${url}`);
			api.redirectTo(url);
		} else {
			console.log(`start over`);
		}
	},
};

module.exports = {
	com: com,
};
