const $ = (name) => require(`${name}.js`)[name];
const db = $("db");
const api = $("api");

// start_normal
// randLogin
// randLoginG
// userLogin
// userLoginG
// userG
function start_post(app, param = {}) {
	let target = "guide";

	db.user.save(app.user);

	api.hideLoadingEx();

	console.log(`start over`);

	if (param.opengid) {
		if (param.gid) {
			let gid = db.user.getGid(app.user, param.opengid);
			if (gid != param.gid) {
				db.user.addGroup(app.user, param.gid, param.opengid);
				db.user.save(app.user);
			}

			api.navigateToEx("group", {
				opengid: param.opengid,
				gid: param.gid,
			});
		} else {
			api.navigateToEx("checkin", { opengid: param.opengid });
		}
	} else {
		let groups = db.user.getGroups(app.user);
		let count = groups ? groups.length : 0;

		switch (count) {
			case 1:
				/*
				api.navigateToEx("group", {
					opengid: groups[0].opengid,
					gid: groups[0].gid,
				});
				*/
				api.redirectToEx("me");
				break;
			case 0:
			default:
				api.redirectToEx("me");
				break;
		}
	}
}

const _gw = {
	start_post: start_post,
};

module.exports = {
	_gw: _gw,
};
