// common/mp_gw.js
const include = (name) => require(`../${name}.js`)[name];

const db = include("db");
const api = include("api");

function redirectTo(name, opengid, gid) {
	let url = `/pages/${name}/${name}?opengid=${opengid}`;

	if (gid) {
		url = `${url}?gid=${gid}`;
	}

	console.log(`start over redirectTo ${url}`);
	api.redirectTo(url);
}

const mp_gw = {
	start_post: (app, g = {}) => {
		db.user.save(app.user);

		api.hideLoadingEx();

		if (g.opengid) {
			let name = g.gid ? "group" : "guide";

			redirectTo(name, g.opengid, g.gid);
		} else {
			console.log(`start over`);
		}
	},
};

module.exports = {
	mp_gw: mp_gw,
};
