// com.js
// common of mp & gw

const db = require('db.js').db;
const api = require('api.js').api;

const com = {
	start_post: (app, group = {}) => {
		db.user.save(app.user);

		api.hideLoadingEx();

		if (group.opengid) {
			let url = `/pages/guide/guide?opengid=${group.opengid}`;

			if (group.gid) {
				url = `${url}?gid=${group.gid}`;
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
