// gw.js

const helper = require('helper.js').helper;
const mp_gw = require('common/mp_gw.js').mp_gw;
const api = require('api.js').api;
const db = require('db.js').db;

const $domain = {
	master: "lambda-lab.cn",
	sub: "note.mp",
	path: {
		randLogin: "/rand/login",
		rangLoginG: "/rand/login/gsecret",
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
	},

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

		for (let field of fields) {
			checker = checker.exist(field)
		}

		return obj;
	},

	checkUser: (name, obj) =>
		$gw.check(name, obj.user, "uid", "session", "nn"),

	logHandle: (name, obj) => console.log(`${name} recv obj=${JSON.stringify(obj)}`),

	request: (xid, path, data) => {
		let url = $domain.url(xid, path);
		let method = "PUT";

		console.info(`request url:${url} data:${JSON.stringify(data)}`);

		return api.request({ url, method, data });
	},
};

const gw = {
	randLogin: {
		request: (param = { jscode }) =>
			$gw.request(helper.bkdr(param.jscode), $domain.path.randLogin, param),
		handle: (app, obj) => {
			let name = "randLogin";
			let user = app.user;

			$gw.logHandle(name, obj);
			$gw.check(name, obj, "user");
			$gw.checkUser(name, obj);

			db.user.vcopy(user, obj.user);
			mp_gw.start_post(app);
		},
	},

	randLoginG: {
		request: (param = { jscode, gsecret }) =>
			$gw.request(helper.bkdr(param.jscode), $domain.path.randLoginG, param),
		handle: (app, obj) => {
			let name = "randLoginG";
			let user = app.user;

			$gw.logHandle(name, obj);
			$gw.check(name, obj, "user", "gid", "opengid");
			$gw.checkUser(name, obj);

			db.user.vcopy(user, obj.user);

			mp_gw.start_post(app, {
				opengid: obj.opengid,
				gid: obj.gid,
			});
		},
	},

	userLogin: {
		request: (param = { uid, jscode }) =>
			$gw.request(param.uid, $domain.path.userLogin, param),
		handle: (app, obj) => {
			let name = "userLogin";
			let user = app.user;

			$gw.logHandle(name, obj);
			$gw.check(name, obj, "user");
			$gw.checkUser(name, obj);

			db.user.vcopy(user, obj.user);
			mp_gw.start_post(app);
		},
	},

	userLoginG: {
		request: (param = { uid, jscode, gsecret }) =>
			$gw.request(param.uid, $domain.path.userLoginG, param),
		handle: (app, obj) => {
			let name = "userLoginG";
			let user = app.user;

			$gw.logHandle(name, obj);
			$gw.check("userLoginG", obj, "user", "gid", "opengid");
			$gw.checkUser(name, obj);

			db.user.vcopy(user, obj.user);

			mp_gw.start_post(app, {
				opengid: obj.opengid,
				gid: obj.gid,
			});
		},
	},

	userG: {
		request: (param = { uid, session, gsecret }) =>
			$gw.request(param.uid, $domain.path.userG, param),
		handle: (app, obj) => {
			let name = "userG";

			$gw.logHandle(name, obj);
			// maybe exist gid
			$gw.check(name, obj, "opengid");

			mp_gw.start_post(app, {
				opengid: obj.opengid,
				gid: obj.gid,
			});
		},
	},

	userCheckin: {
		request: (param = { uid, session, opengid, role, name, nick, students }) =>
			$gw.request(param.uid, $domain.path.userCheckin, param),
		handle: (app, obj) => {
			let name = "userCheckin";

			$gw.logHandle(name, obj);
			$gw.check(name, obj, "group");
		},
	},

	groupCheckin: {
		request: (param = { uid, session, gid, role, name, nick, students }) =>
			$gw.request(param.uid, $domain.path.groupCheckin, param),
		handle: (app, obj) => {
			let name = "groupCheckin";

			$gw.logHandle(name, obj);
			$gw.check(name, obj, "group");
		},
	},

	groupGet: {
		request: (param = { uid, session, gid }) =>
			$gw.request(param.uid, $domain.path.groupGet, param),
		handle: (app, obj) => {
			let name = "groupGet";

			$gw.logHandle(name, obj);
			$gw.check(name, obj, "group");
		},
	},

	groupSync: {
		request: (param = { uid, session, gid, ver }) =>
			$gw.request(param.uid, $domain.path.groupSync, param),
		handle: (app, obj) => {
			let name = "groupSync";

			$gw.logHandle(name, obj);
			$gw.check(name, obj);
		},
	},

	groupNewAdviser: {
		request: (param = { uid, session, gid, adviser }) =>
			$gw.request(param.uid, $domain.path.groupNewAdviser, param),
		handle: (app, obj) => {
			let name = "groupNewAdviser";

			$gw.logHandle(name, obj);
			$gw.check(name, obj, "group");
		},
	},

	groupDel: {
		request: (param = { uid, session, gid }) =>
			$gw.request(param.uid, $domain.path.groupDel, param),
		handle: (app, obj) => {
			let name = "groupDel";

			$gw.logHandle(name, obj);
			$gw.check(name, obj);
		},
	},

	groupDelUser: {
		request: (param = { uid, session, gid, user }) =>
			$gw.request(param.uid, $domain.path.groupDelUser, param),
		handle: (app, obj) => {
			let name = "groupDelUser";

			$gw.logHandle(name, obj);
			$gw.check(name, obj);
		},
	},

	groupDelStudent: {
		request: (param = { uid, session, gid, student }) =>
			$gw.request(param.uid, $domain.path.groupDelStudent, param),
		handle: (app, obj) => {
			let name = "groupDelStudent";

			$gw.logHandle(name, obj);
			$gw.check(name, obj);
		},
	},

	payPre: {
		request: (param = { uid, session, gid, money, time, lease }) =>
			$gw.request(param.uid, $domain.path.payPre, param),
		handle: (app, obj) => {
			let name = "payPre";

			$gw.logHandle(name, obj);
			$gw.check(name, obj, "pay");
		},
	},

	topicNew: {
		request: (param = { uid, session, gid, type, topic }) =>
			$gw.request(param.uid, $domain.path.topicNew, param),
		handle: (app, obj) => {
			let name = "topicNew";

			$gw.logHandle(name, obj);
			$gw.check(name, obj, "topicx");
		},
	},

	topicAct: {
		request: (param = { uid, session, gid, tid, action }) =>
			$gw.request(param.uid, $domain.path.topicAct, param),
		handle: (app, obj) => {
			let name = "topicAct";

			$gw.logHandle(name, obj);
			$gw.check(name, obj, "topicx");
		},
	},

	topicGet: {
		request: (param = { uid, session, gid, tid }) =>
			$gw.request(param.uid, $domain.path.topicGet, param),
		handle: (app, obj) => {
			let name = "topicGet";

			$gw.logHandle(name, obj);
			$gw.check(name, obj, "topicx");
		},
	},

	topicGetOpen: {
		request: (param = { uid, session, gid }) =>
			$gw.request(param.uid, $domain.path.topicGetOpen, param),
		handle: (app, obj) => {
			let name = "topicGetOpen";

			$gw.logHandle(name, obj);
			$gw.check(name, obj, "summary");
		},
	},

	topicGetClosed: {
		request: (param = { uid, session, gid }) =>
			$gw.request(param.uid, $domain.path.topicGetClosed, param),
		handle: (app, obj) => {
			let name = "topicGetClosed";

			$gw.logHandle(name, obj);
			$gw.check(name, obj, "summary");
		},
	},

	topicClose: {
		request: (param = { uid, session, gid, tid }) =>
			$gw.request(param.gid, $domain.path.topicClosed, param),
		handle: (app, obj) => {
			let name = "topicClose";

			$gw.logHandle(name, obj);
			$gw.check(name, obj, "topicx");
		},
	},

	topicDel: {
		request: (param = { uid, session, gid, tid }) =>
			$gw.request(param.gid, $domain.path.topicDel, param),
		handle: (app, obj) => {
			let name = "topicDel";

			$gw.logHandle(name, obj);
			$gw.check(name, obj);
		},
	},
};

module.exports = {
	gw: gw,
};
