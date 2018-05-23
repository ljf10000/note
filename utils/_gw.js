const $ = (name) => require(`${name}.js`)[name];
const db = $("db");
const api = $("api");

// start_normal
// randLogin
// randLoginG
// userLogin
// userLoginG
// userG
function start_post(app, group = {}) {
	let param = {};

	if (group.opengid) {
		// 如果携带opengid，则说明从群组启动
		console.log(`start post with ${JSON.stringify(group)}`);

		param.opengid = group.opengid;
		if (group.gid) {
			// 如果携带gid，则说明用户已经加入群组
			// 先重定向到 me 页，携带 opengid & gid信息
			let gid = db.user.getGid(app.user, group.opengid);
			if (gid != group.gid) {
				db.user.addGroup(app.user, group.gid, group.opengid);
				db.user.save(app.user);
			}

			param.gid = gid;
		} else {
			// 如果未携带gid，则说明用户需要checkin
			// 先重定向到 me 页，携带 opengid 信息
		}
	} else {
		console.log(`start post`);
	}

	if (app.start.invite) {
		if (param.gid) {
			api.navigateToEx("group", param);
		} else {
			api.navigateToEx("checkin", param);
		}
	} else {
		api.redirectToEx("me", param);
	}
}

const _gw = {
	start_post: start_post,
};

module.exports = {
	_gw: _gw,
};
