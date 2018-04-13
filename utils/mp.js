// mp.js

const com = require('com.js').com;
const res = require('res.js').res;
const api = require('api.js').api;
const gw = require('gw.js').gw;

const $mp = {
	login_fail: (app, msg, e) => {
		api.hideLoadingEx();

		console.log(`${msg} failed: ${JSON.stringify(e)}`);

		// todo: notify user mp-login failed
	},

	login_fail_wx: (app, e) => {
		api.hideLoadingEx();

		console.error(`wx login failed: ${JSON.stringify(e)}`);

		// todo: notify user wx-login failed
	},

	start: (app, gsecret) => {
		if (0 == app.user.uid) {
			return $mp.start_login(app, gsecret);
		} else {
			return api.checkSession().then(
				v => $mp.start_normal(app, gsecret, v),
				e => $mp.start_login(app, gsecret)
			);
		}
	},

	start_normal: (app, gsecret, v) => {
		if (gsecret) {
			return mp.userG(app, gsecret);
		} else {
			console.log(`start normal`);

			com.start_post(app);
		}
	},

	start_login: (app, gsecret) => {
		api.showLoadingEx(res.wxLogin(app));

		return api.login().then(
			v => $mp.login(app, v.code, gsecret),
			e => $mp.login_fail_wx(app, e)
		);
	},

	login: (app, jscode, gsecret) => {
		api.showLoadingEx(res.mpLogin(app));

		if (app.user.uid) {
			if (gsecret) {
				return mp.userLoginG(app, jscode, gsecret);
			} else {
				return mp.userLogin(app, jscode);
			}
		} else {
			if (gsecret) {
				return mp.randLoginG(app, jscode, gsecret);
			} else {
				return mp.randLogin(app, jscode);
			}
		}
	},

	loginBy: (app, method, param) => {
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
			v => obj.handle(app, v.data),
			e => $mp.login_fail(app, msg, e)
		);
	},
};

const mp = {
	start: (app, options) => {
		let shareTicket = options.shareTicket;

		if (shareTicket) {
			console.log(`mp start with shareTicket:${shareTicket}`);

			api.getShareInfo(shareTicket).then(v => {
				let iv = v.iv;
				let encryptedData = v.encryptedData;

				console.log(`mp getShareInfo: shareTicket:${shareTicket} ==> encryptedData:${encryptedData} iv:${iv}`);

				$mp.start(app, { encryptedData, iv });
			})
		} else {
			console.log(`mp start normal`);

			$mp.start(app);
		}
	},

	userG: (app, gsecret) => $mp.loginBy(app, "userG", { uid: app.user.uid, session: app.user.session, gsecret }),
	userLoginG: (app, jscode, gsecret) => $mp.loginBy(app, "userLoginG", { uid: app.user.uid, jscode, gsecret }),
	randLoginG: (app, jscode, gsecret) => $mp.loginBy(app, "randLoginG", { jscode, gsecret }),
	userLogin: (app, jscode) => $mp.loginBy(app, "userLogin", { uid: app.user.uid, jscode }),
	randLogin: (app, jscode) => $mp.loginBy(app, "randLogin", { jscode }),
};

module.exports = {
	mp: mp,
};