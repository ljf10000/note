// mp.js

const com = require('com.js').com;
const res = require('res.js').res;
const api = require('api.js').api;
const gw = require('gw.js').gw;

const $mp = {
	login_fail: (app, e) => {
		let msg = res.mpLoginFail(app);

		api.hideLoadingEx();

		console.error(`${msg}: ${JSON.stringify(e)}`);

		api.showModal(res.app(app), msg);
	},

	login_fail_wx: (app,  e) => {
		let msg = res.wxLoginFail(app);

		api.hideLoadingEx();

		console.error(`${msg}: ${JSON.stringify(e)}`);

		api.showModal(res.app(app), msg);
	},

	start: (app) => {
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

			com.start_post(app);
		}
	},

	start_login: (app) => {
		api.showLoadingEx(res.wxLogin(app));

		return api.login().then(
			v => {
				app.login.jscode = v.code;

				return $mp.login(app);
			},
			e => $mp.login_fail_wx(app, e)
		);
	},

	login: (app) => {
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
			msg = `${msg} gsecret:${JSON.stringify({ iv: param.gsecret.iv})}`;
		}
		console.log(msg);

		let obj = gw[method];
		return obj.request(param).then(
			v => obj.handle(app,  v.data),
			e => $mp.login_fail(app,  e)
		);
	},
};

const mp = {
	start: (app, shareTicket) => {
		if (shareTicket) {
			console.log(`mp start with shareTicket:${shareTicket}`);

			api.getShareInfo(shareTicket).then(v => {
				console.log(`mp getShareInfo: shareTicket:${shareTicket} ==> iv:${v.iv}`);

				app.login.gsecret = {
					iv: v.iv,
					encryptedData: v.encryptedData,
				}

				$mp.start(app);
			})
		} else {
			console.log(`mp start normal`);

			$mp.start(app);
		}
	},

	userG: (app) => $mp.loginBy(app, "userG", {
		uid: app.user.uid,
		session: app.user.session,
		gsecret: app.login.gsecret,
	}),
	userLoginG: (app) => $mp.loginBy(app,  "userLoginG", {
		uid: app.user.uid,
		jscode: app.login.jscode,
		gsecret: app.login.gsecret,
	}),
	randLoginG: (app) => $mp.loginBy(app,  "randLoginG", {
		jscode: app.login.jscode,
		gsecret: app.login.gsecret,
	}),
	userLogin: (app) => $mp.loginBy(app,  "userLogin", {
		uid: app.user.uid,
		jscode: app.login.jscode,
	}),
	randLogin: (app) => $mp.loginBy(app, "randLogin", { jscode: app.login.jscode }),
};

module.exports = {
	mp: mp,
};