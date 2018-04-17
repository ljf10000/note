// mp.js

const mp_gw = require('common/mp_gw.js').mp_gw;
const res = require('res.js').res;
const api = require('api.js').api;
const gw = require('gw.js').gw;

const $mp = {
	start: (app, gsecret) => {
		if (gsecret) {
			app.login.gsecret = gsecret;
		}

		if (0 == app.user.uid) {
			return $mp.start_login(app);
		} else {
			return api.checkSession().then(
				v => $mp.start_normal(app),
				e => $mp.start_login(app)
			);
		}
	},

	start_normal: (app) => {
		if (app.login.gsecret) {
			return mp.userG(app);
		} else {
			console.log(`start normal`);

			mp_gw.start_post(app);
		}
	},

	start_login: (app) => {
		api.showLoadingEx(res.info(app, "wx login"));

		return api.login().then(
			v => $mp.login(app, v.code),
			e => {
				let msg = res.info(app, "wx login fail");

				api.hideLoadingEx();

				console.error(`${msg}: ${JSON.stringify(e)}`);

				api.showModal(res.app(app), msg);
			}
		);
	},

	login: (app, jscode) => {
		app.login.jscode = jscode;

		api.showLoadingEx(res.info(app, "mp login"));

		if (app.user.uid) {
			if (app.login.gsecret) {
				return mp.userLoginG(app);
			} else {
				return mp.userLogin(app);
			}
		} else {
			if (app.login.gsecret) {
				return mp.randLoginG(app);
			} else {
				return mp.randLogin(app);
			}
		}
	},

	loginBy: (app, method, param) => {
		app.login.param = param;
		app.login.method = method;

		let msg = res.join(app, "login");
		
		msg = `${msg} ${method}`;
		api.showLoadingEx(msg);

		msg = `start ${msg} with`;
		if (param.uid) {
			msg = `${msg} uid:${param.uid}`;
		}
		if (param.jscode) {
			msg = `${msg} jscode:${param.jscode}`;
		}
		if (param.gsecret) {
			msg = `${msg} gsecret:${JSON.stringify({ iv: param.gsecret.iv })}`;
		}
		console.log(msg);

		return $mp.callBy(app, method, param);
	},

	callBy: (obj, method, param) => {
		let r = gw[method];

		if ($mp.isPage(obj)) {
			$mp.initUserParam(getApp(), param);
		}

		return r.request(param).then(
			v => r.success(obj, v.data),
			e => r.fail(obj, e)
		);
	},

	initUserParam: (app, param) => {
		let user = app.user;

		param.uid = user.uid;
		param.session = user.session;
	},
	isApp: (obj) => true === obj.__i_m_app__,
	isPage: (obj) => !$mp.isApp(obj),
};

const mp = {
	start: (app, shareTicket) => {
		if (shareTicket) {
			console.log(`mp start with shareTicket:${shareTicket}`);

			api.getShareInfo(shareTicket).then(v => {
				console.log(`mp getShareInfo: shareTicket:${shareTicket} ==> iv:${v.iv}`);

				$mp.start(app, {
					iv: v.iv,
					encryptedData: v.encryptedData,
				});
			})
		} else {
			console.log(`mp start normal`);

			$mp.start(app);
		}
	},

	randLogin: (app) => $mp.loginBy(app, "randLogin", {
		jscode: app.login.jscode,
	}),
	randLoginG: (app) => $mp.loginBy(app, "randLoginG", {
		jscode: app.login.jscode,
		gsecret: app.login.gsecret,
	}),

	userLogin: (app) => $mp.loginBy(app, "userLogin", {
		uid: app.user.uid,
		jscode: app.login.jscode,
	}),
	userLoginG: (app) => $mp.loginBy(app, "userLoginG", {
		uid: app.user.uid,
		jscode: app.login.jscode,
		gsecret: app.login.gsecret,
	}),

	userG: (app) => $mp.loginBy(app, "userG", {
		uid: app.user.uid,
		session: app.user.session,
		gsecret: app.login.gsecret,
	}),

	userCheckin: (page, param = { opengid, role, name, nick, students }) =>
		$mp.callBy(page, "userCheckin", param),

	groupCheckin: (page, param = { gid, role, name, nick, students }) =>
		$mp.callBy(page, "groupCheckin", param),

	groupGet: (page, param = { gid }) =>
		$mp.callBy(page, "groupGet", param),

	groupSync: (page, param = { gid, ver }) =>
		$mp.callBy(page, "groupSync", param),

	groupNewAdviser: (page, param = { gid, adviser }) =>
		$mp.callBy(page, "groupNewAdviser", param),

	groupDel: (page, param = { gid }) =>
		$mp.callBy(page, "groupDel", param),

	groupDelUser: (page, param = { gid, user }) =>
		$mp.callBy(page, "groupDelUser", param),

	groupDelStudent: (page, param = { gid, student }) =>
		$mp.callBy(page, "groupDelStudent", param),

	payPre: (page, param = { gid, money, time, lease }) =>
		$mp.callBy(page, "payPre", param),

	topicNew: (page, param = { gid, type, topic }) =>
		$mp.callBy(page, "topicNew", param),

	topicAct: (page, param = { gid, tid, action }) =>
		$mp.callBy(page, "topicAct", param),

	topicGet: (page, param = { gid, tid }) =>
		$mp.callBy(page, "topicGet", param),

	topicGetOpen: (page, param = { gid }) =>
		$mp.callBy(page, "topicGetOpen", param),

	topicGetClosed: (page, param = { gid }) =>
		$mp.callBy(page, "topicGetClosed", param),

	topicClose: (page, param = { gid, tid }) =>
		$mp.callBy(page, "topicClose", param),

	topicDel: (page, param = { gid, tid }) =>
		$mp.callBy(page, "topicDel", param),
};

module.exports = {
	mp: mp,
};