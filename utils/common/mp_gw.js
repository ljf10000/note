// common/mp_gw.js

const db = require('db.js').db;
const api = require('api.js').api;

const mp_gw = {
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
	mp_gw: mp_gw,
};
