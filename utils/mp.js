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
		api.showLoadingEx(res.wxLogin(app));

		return api.login().then(
			v => $mp.login(app, v.code),
			e => {
				let msg = res.wxLoginFail(app);

				api.hideLoadingEx();

				console.error(`${msg}: ${JSON.stringify(e)}`);

				api.showModal(res.app(app), msg);
			}
		);
	},

	login: (app, jscode) => {
		app.login.jscode = jscode;

		api.showLoadingEx(res.mpLogin(app));

		if (app.user.uid) {
			if (app.login.gsecret) {
				return mp.userLoginG(app);
			} else {
				return mp.userLogin(app);
			}
		} else {
			if (gsecret) {
				return mp.randLoginG(app);
			} else {
				return mp.randLogin(app);
			}
		}
	},

	loginBy: (app, method, param) => {
		app.login.param = param;
		app.login.method = method;

		let msg = `${res.mpLogin(app)} ${method}`;
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

	callBy: (app, method, param) => {
		let obj = gw[method];

		return obj.request(param).then(
			v => obj.success(app, v.data),
			e => obj.fail(app, e)
		);
	},

	initUserParam: (app, param) => {
		let user = app.user;

		param.uid = user.uid;
		param.session = user.session;
	}
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

	userCheckin: (app, param = { opengid, role, name, nick, students }) => {
		$mp.initUserParam(app, param);

		return $mp.callBy(app, "userCheckin", param);
	},

	groupCheckin: (app, param = { gid, role, name, nick, students }) => {
		$mp.initUserParam(app, param);

		return $mp.callBy(app, "groupCheckin", param);
	},

	groupGet: (app, param = { gid }) => {
		$mp.initUserParam(app, param);

		return $mp.callBy(app, "groupGet", param);
	},

	groupSync: (app, param = { gid, ver }) => {
		$mp.initUserParam(app, param);

		return $mp.callBy(app, "groupSync", param);
	},

	groupNewAdviser: (app, param = { gid, adviser }) => {
		$mp.initUserParam(app, param);

		return $mp.callBy(app, "groupNewAdviser", param);
	},

	groupDel: (app, param = { gid }) => {
		$mp.initUserParam(app, param);

		return $mp.callBy(app, "groupDel", param);
	},

	groupDelUser: (app, param = { gid, user }) => {
		$mp.initUserParam(app, param);

		return $mp.callBy(app, "groupDelUser", param);
	},

	groupDelStudent: (app, param = { gid, student }) => {
		$mp.initUserParam(app, param);

		return $mp.callBy(app, "groupDelStudent", param);
	},

	payPre: (app, param = { gid, money, time, lease}) => {
		$mp.initUserParam(app, param);

		return $mp.callBy(app, "payPre", param);
	},

	topicNew: (app, param = { gid, type, topic }) => {
		$mp.initUserParam(app, param);

		return $mp.callBy(app, "topicNew", param);
	},

	topicAct: (app, param = { gid, tid, action  }) => {
		$mp.initUserParam(app, param);

		return $mp.callBy(app, "topicAct", param);
	},

	topicGet: (app, param = { gid, tid }) => {
		$mp.initUserParam(app, param);

		return $mp.callBy(app, "topicGet", param);
	},

	topicGetOpen: (app, param = { gid }) => {
		$mp.initUserParam(app, param);

		return $mp.callBy(app, "topicGetOpen", param);
	},

	topicGetClosed: (app, param = { gid }) => {
		$mp.initUserParam(app, param);

		return $mp.callBy(app, "topicGetClosed", param);
	},

	topicClose: (app, param = { gid, tid }) => {
		$mp.initUserParam(app, param);

		return $mp.callBy(app, "topicClose", param);
	},

	topicDel: (app, param = { gid, tid }) => {
		$mp.initUserParam(app, param);

		return $mp.callBy(app, "topicDel", param);
	},
};

module.exports = {
	mp: mp,
};