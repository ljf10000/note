// mp.js

const com = require('com.js').com;
const res = require('res.js').res;
const api = require('api.js').api;
const gw = require('gw.js').gw;

const $mp = {
	login_fail: (app, opt, e) => {
		let msg = res.mpLoginFail(app);

		api.hideLoadingEx();

		console.error(`${msg}: ${JSON.stringify(e)}`);

		api.showModal(res.app(app), msg);
	},

	login_fail_wx: (app, opt, e) => {
		let msg = res.wxLoginFail(app);

		api.hideLoadingEx();

		console.error(`${msg}: ${JSON.stringify(e)}`);

		api.showModal(res.app(app), msg);
	},

	start: (app, opt) => {
		if (0 == app.user.uid) {
			return $mp.start_login(app, opt);
		} else {
			return api.checkSession().then(
				v => $mp.start_normal(app, opt),
				e => $mp.start_login(app, opt)
			);
		}
	},

	start_normal: (app, opt) => {
		if (opt.gsecret) {
			return mp.userG(app, opt);
		} else {
			console.log(`start normal`);

			com.start_post(app, opt);
		}
	},

	start_login: (app, opt) => {
		api.showLoadingEx(res.wxLogin(app));

		return api.login().then(
			v => {
				opt.jscode = v.code;

				return $mp.login(app, opt);
			},
			e => $mp.login_fail_wx(app, opt, e)
		);
	},

	login: (app, opt) => {
		api.showLoadingEx(res.mpLogin(app));

		if (app.user.uid) {
			if (opt.gsecret) {
				return mp.userLoginG(app, opt);
			} else {
				return mp.userLogin(app, opt);
			}
		} else {
			if (gsecret) {
				return mp.randLoginG(app, opt);
			} else {
				return mp.randLogin(app, opt);
			}
		}
	},

	loginBy: (app, opt, method, param) => {
		opt.param = param;
		opt.method = method;

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
			msg = `${msg} gsecret:${JSON.stringify(param.gsecret)}`;
		}
		console.log(msg);

		let obj = gw[method];
		return obj.request(param).then(
			v => obj.handle(app, opt, v.data),
			e => $mp.login_fail(app, opt, e)
		);
	},
};

const mp = {
	start: (app, opt) => {
		let shareTicket = opt.shareTicket;

		if (shareTicket) {
			console.log(`mp start with shareTicket:${shareTicket}`);

			api.getShareInfo(shareTicket).then(v => {
				console.log(`mp getShareInfo: shareTicket:${shareTicket} ==> iv:${v.iv} encryptedData:${v.encryptedData}`);

				opt.gsecret = {
					iv: v.iv,
					encryptedData: v.encryptedData,
				}

				$mp.start(app, opt);
			})
		} else {
			console.log(`mp start normal`);

			$mp.start(app, opt);
		}
	},

	userG: (app, opt) => $mp.loginBy(app, opt, "userG", {
		uid: app.user.uid,
		session: app.user.session,
		gsecret: opt.gsecret,
	}),
	userLoginG: (app, opt) => $mp.loginBy(app, opt, "userLoginG", {
		uid: app.user.uid,
		jscode: opt.jscode,
		gsecret: opt.gsecret,
	}),
	randLoginG: (app, opt) => $mp.loginBy(app, opt, "randLoginG", {
		jscode: opt.jscode,
		gsecret: opt.gsecret,
	}),
	userLogin: (app, opt) => $mp.loginBy(app, opt, "userLogin", {
		uid: app.user.uid,
		jscode: opt.jscode,
	}),
	randLogin: (app, opt) => $mp.loginBy(app, opt, "randLogin", { jscode: opt.jscode }),
};

module.exports = {
	mp: mp,
};