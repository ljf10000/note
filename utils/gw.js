// gw.js
const $ = (name) => require(`${name}.js`)[name];
const _gw = $("_gw");
const helper = $("helper");
const api = $("api");
const res = $("res");
const db = $("db");

const $path = {
	randLogin: "/rand/login",
	randLoginG: "/rand/login/gsecret",

	userLogin: "/user/login",
	userLoginG: "/user/login/gsecret",
	userG: "/user/gsecret",
	userCheckin: "/user/checkin",

	groupCheckin: "/group/checkin",
	groupGet: "/group/get",
	groupSync: "/group/sync",
	groupNewAdviser: "/group/new_adviser",
	groupDel: "/group/del",
	groupDelUser: "/group/del_user",
	groupDelStudent: "/group/del_student",

	payPre: "/group/pay/pre",

	topicNew: "/group/topic/new",
	topicAct: "/group/topic/act",
	topicGetOpen: "/group/topic/get/open",
	topicGetClosed: "/group/topic/get/closed",
	topicGet: "/group/topic/get",
	topicDel: "/group/topic/del",
	topicClose: "/group/topic/close",
};

const $domain = {
	master: "lambda-lab.cn",
	sub: "note.mp",
	path: $path,

	url: (xid, path) => {
		let nn = getApp().user.nn;
		const idx = (xid >>> 0) % (nn >>> 0);
		let ids;

		console.log(`url xid=${xid} nn=${nn} idx=${idx}`);

		if (idx < 10) {
			ids = "0" + idx;
		} else if (idx < 19) {
			ids = "" + idx;
		} else { // idx >= 19
			ids = "www";
		}

		return "https://" + ids + "." + $domain.sub + "." + $domain.master + path;
	},
};

const $gw = {
	error: (name, err) => {
		throw new Error(`${name} error: ${err}`);
	},

	checker: (name, obj) => {
		if (obj.error) {
			$gw.error(name, obj);
		}

		let chk = {
			exist: (field) => {
				if (!obj[field]) {
					$gw.error(name, `no ${field}`);
				}

				return chk;
			},
		};

		return chk;
	},

	check: (name, obj, ...fields) => {
		let checker = $gw.checker(name, obj);

		fields.map(v => checker.exist(v));

		return obj;
	},

	checkUser: (name, obj) =>
		$gw.check(name, obj.user, "uid", "session", "nn"),

	success: (name, obj) => {
		console.log(`gw ${name} success`);
	},

	request: (xid, path, data) => {
		let url = $domain.url(xid, path);
		let method = "PUT";

		console.info(`request url:${url} data:${JSON.stringify(data)}`);

		return api.request({ url, method, data });
	},

	fail: (obj, e, ...keys) => {
		// obj is app or page
		let msg = res.Join("mp", ...keys, "fail");

		api.hideLoadingEx();

		api.showModal(res.APP, msg);
	},
	login_fail: (obj, e) => $gw.fail(obj, e, "login"),
};

function tryPageCb(page, name) {
	console.log(`try name: ${JSON.stringify(page)}`);
	
	if (helper.isPage(page)) {
		let cb = page[name];
		if (cb) {
			cb(obj);
		}
	}
}

const randLogin = {
	request: (param = { jscode }) =>
		$gw.request(helper.bkdr(param.jscode), $path.randLogin, param),
	success: (app, obj) => {
		let name = "randLogin";
		let user = app.user;

		$gw.success(name, obj);
		$gw.check(name, obj, "user");
		$gw.checkUser(name, obj);

		db.user.vcopy(user, obj.user);
		_gw.start_post(app);
	},
	fail: (app, e) => $gw.login_fail(app, e),
};

const randLoginG = {
	request: (param = { jscode, gsecret }) =>
		$gw.request(helper.bkdr(param.jscode), $path.randLoginG, param),
	success: (app, obj) => {
		let name = "randLoginG";
		let user = app.user;

		$gw.success(name, obj);
		$gw.check(name, obj, "user", "opengid");
		$gw.checkUser(name, obj);

		db.user.vcopy(user, obj.user);

		_gw.start_post(app, {
			opengid: obj.opengid,
			gid: obj.gid,
		});
	},
	fail: (app, e) => $gw.login_fail(app, e),
};

const userLogin = {
	request: (param = { uid, jscode }) =>
		$gw.request(param.uid, $path.userLogin, param),
	success: (app, obj) => {
		let name = "userLogin";
		let user = app.user;

		$gw.success(name, obj);
		$gw.check(name, obj, "user");
		$gw.checkUser(name, obj);

		db.user.vcopy(user, obj.user);
		_gw.start_post(app);
	},
	fail: (app, e) => $gw.login_fail(app, e),
};

const userLoginG = {
	request: (param = { uid, jscode, gsecret }) =>
		$gw.request(param.uid, $path.userLoginG, param),
	success: (app, obj) => {
		let name = "userLoginG";
		let user = app.user;

		$gw.success(name, obj);
		$gw.check("userLoginG", obj, "user", "gid", "opengid");
		$gw.checkUser(name, obj);

		db.user.vcopy(user, obj.user);

		_gw.start_post(app, {
			opengid: obj.opengid,
			gid: obj.gid,
		});
	},
	fail: (app, e) => $gw.login_fail(app, e),
};

const userG = {
	request: (param = { uid, session, gsecret }) =>
		$gw.request(param.uid, $path.userG, param),
	success: (app, obj) => {
		let name = "userG";

		$gw.success(name, obj);
		// maybe exist gid
		$gw.check(name, obj, "opengid");

		_gw.start_post(app, {
			opengid: obj.opengid,
			gid: obj.gid,
		});
	},
	fail: (app, e) => $gw.login_fail(app, e),
};

const userCheckin = {
	request: (param = { uid, session, opengid, role, name, nick, students }) =>
		$gw.request(param.uid, $path.userCheckin, param),
	success: (page, obj) => {
		let name = "userCheckin";

		$gw.success(name, obj);
		$gw.check(name, obj, "gid");

		api.redirectToEx("group", {
			gid: obj.gid,
			opengid: page.data.opengid,
			event: "checkin",
			act: "redirect",
			src: page.name,
		});
	},
	fail: (page, e) => $gw.fail(page, e, "user", "checkin"),
};

const groupCheckin = {
	request: (param = { uid, session, gid, role, name, nick, students }) =>
		$gw.request(param.gid, $path.groupCheckin, param),
	success: (page, obj) => {
		let name = "groupCheckin";

		$gw.success(name, obj);
		$gw.check(name, obj, "gid");
	},
	fail: (page, e) => $gw.fail(page, e, "group", "checkin"),
};

const groupGet = {
	request: (param = { uid, session, gid }) =>
		$gw.request(param.gid, $path.groupGet, param),
	success: (page, obj) => {
		let name = "groupGet";

		$gw.success(name, obj);
		$gw.check(name, obj, "group");

		tryPageCb(page, name);
	},
	fail: (page, e) => $gw.fail(page, e, "group", "get"),
};

const groupSync = {
	request: (param = { uid, session, gid, ver }) =>
		$gw.request(param.gid, $path.groupSync, param),
	success: (page, obj) => {
		let name = "groupSync";

		$gw.success(name, obj);
		$gw.check(name, obj);

		tryPageCb(page, name);
	},
	fail: (page, e) => $gw.fail(page, e, "group", "sync"),
};

const groupNewAdviser = {
	request: (param = { uid, session, gid, adviser }) =>
		$gw.request(param.gid, $path.groupNewAdviser, param),
	success: (page, obj) => {
		let name = "groupNewAdviser";

		$gw.success(name, obj);
		$gw.check(name, obj, "group");
	},
	fail: (page, e) => $gw.fail(page, e, "group", "new", "adviser"),
};

const groupDel = {
	request: (param = { uid, session, gid }) =>
		$gw.request(param.gid, $path.groupDel, param),
	success: (page, obj) => {
		let name = "groupDel";

		$gw.success(name, obj);
		$gw.check(name, obj);
	},
	fail: (page, e) => $gw.fail(page, e, "group", "del"),
};

const groupDelUser = {
	request: (param = { uid, session, gid, user }) =>
		$gw.request(param.gid, $path.groupDelUser, param),
	success: (page, obj) => {
		let name = "groupDelUser";

		$gw.success(name, obj);
		$gw.check(name, obj);
	},
	fail: (page, e) => $gw.fail(page, e, "group", "del", "user"),
};

const groupDelStudent = {
	request: (param = { uid, session, gid, student }) =>
		$gw.request(param.gid, $path.groupDelStudent, param),
	success: (page, obj) => {
		let name = "groupDelStudent";

		$gw.success(name, obj);
		$gw.check(name, obj);
	},
	fail: (page, e) => $gw.fail(page, e, "group", "del", "student"),
};

const payPre = {
	request: (param = { uid, session, gid, money, time, lease }) =>
		$gw.request(param.gid, $path.payPre, param),
	success: (page, obj) => {
		let name = "payPre";

		$gw.success(name, obj);
		$gw.check(name, obj, "pay");
	},
	fail: (page, e) => $gw.fail(page, e, "group", "pre", "pay"),
};

const topicNew = {
	request: (param = { uid, session, gid, type, topic }) =>
		$gw.request(param.gid, $path.topicNew, param),
	success: (page, obj) => {
		let name = "topicNew";

		$gw.success(name, obj);
		$gw.check(name, obj, "topicx");
	},
	fail: (page, e) => $gw.fail(page, e, "topic", "new"),
};

const topicAct = {
	request: (param = { uid, session, gid, tid, action }) =>
		$gw.request(param.gid, $path.topicAct, param),
	success: (page, obj) => {
		let name = "topicAct";

		$gw.success(name, obj);
		$gw.check(name, obj, "topicx");
	},
	fail: (page, e) => $gw.fail(page, e, "topic", "act"),
};

const topicGet = {
	request: (param = { uid, session, gid, tid }) =>
		$gw.request(param.gid, $path.topicGet, param),
	success: (page, obj) => {
		let name = "topicGet";

		$gw.success(name, obj);
		$gw.check(name, obj, "topicx");

		tryPageCb(page, name);
	},
	fail: (page, e) => $gw.fail(page, e, "topic", "get"),
};

const topicGetOpen = {
	request: (param = { uid, session, gid }) =>
		$gw.request(param.gid, $path.topicGetOpen, param),
	success: (page, obj) => {
		let name = "topicGetOpen";

		$gw.success(name, obj);
		$gw.check(name, obj, "summary");

		tryPageCb(page, name);
	},
	fail: (page, e) => $gw.fail(page, e, "topic", "get", "open"),
};

const topicGetClosed = {
	request: (param = { uid, session, gid }) =>
		$gw.request(param.gid, $path.topicGetClosed, param),
	success: (page, obj) => {
		let name = "topicGetClosed";

		$gw.success(name, obj);
		$gw.check(name, obj, "summary");

		tryPageCb(page, name);
	},
	fail: (page, e) => $gw.fail(page, e, "topic", "get", "closed"),
};

const topicClose = {
	request: (param = { uid, session, gid, tid }) =>
		$gw.request(param.gid, $path.topicClosed, param),
	success: (page, obj) => {
		let name = "topicClose";

		$gw.success(name, obj);
		$gw.check(name, obj, "topicx");
	},
	fail: (page, e) => $gw.fail(page, e, "topic", "close"),
};

const topicDel = {
	request: (param = { uid, session, gid, tid }) =>
		$gw.request(param.gid, $path.topicDel, param),
	success: (page, obj) => {
		let name = "topicDel";

		$gw.success(name, obj);
		$gw.check(name, obj);
	},
	fail: (page, e) => $gw.fail(page, e, "topic", "del"),
};

const gw = {
	randLogin,
	randLoginG,
	userLogin,
	userLoginG,
	userG,

	userCheckin,
	groupCheckin,

	groupGet,
	groupSync,
	groupNewAdviser,
	groupDel,
	groupDelUser,
	groupDelStudent,

	payPre,

	topicNew,
	topicAct,
	topicGet,
	topicGetOpen,
	topicGetClosed,
	topicClose,
	topicDel,

	sex: {
		unknow: 0,
		man: 1,
		woman: 2,
		end: 3,
	},

	role: {
		invalid: 0,
		adviser: 1,
		teacher: 2,
		patriarch: 3,
		end: 4,
	},

	topic: {
		vote: 0,
		notice: 1,
		end: 2,
	},
};

module.exports = { gw };
