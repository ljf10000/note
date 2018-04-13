// com.js
// common of mp & gw

const m_db = require('db.js');
const m_api = require('api.js');

const db = m_db.db;
const api = m_api.api;

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
