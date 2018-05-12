// mp.js
const $ = (name) => require(`${name}.js`)[name];
const _gw = $("_gw");
const helper = $("helper");
const res = $("res");
const api = $("api");
const gw = $("gw");

const debug = true;

function start(app, gsecret) {
	if (debug || 0 == app.user.uid) {
		return start_login(app);
	} else {
		return api.checkSession().then(
			v => start_normal(app),
			e => start_login(app)
		);
	}
}

function start_normal(app) {
	if (app.login.gsecret) {
		console.log(`start normal gsecret`);

		return userG(app);
	} else {
		console.log(`start normal`);

		_gw.start_post(app);
	}
}

function start_login(app) {
	return api.login().then(
		v => login(app, v.code),
		e => {
			let msg = res.Transfer("wx login fail");

			console.error(`${msg}: ${JSON.stringify(e)}`);

			api.showModal(res.APP, msg);
		}
	);
}

function login(app, jscode) {
	app.login.jscode = jscode;

	if (debug || 0 == app.user.uid) {
		if (app.login.gsecret) {
			return randLoginG(app);
		} else {
			return randLogin(app);
		}
	} else {
		if (app.login.gsecret) {
			return userLoginG(app);
		} else {
			return userLogin(app);
		}
	}
}

function loginBy(app, method, param) {
	app.login.param = param;
	app.login.method = method;

	let msg = `start ${method} with`;
	if (param.uid) {
		msg = `${msg} uid:${param.uid}`;
	}
	if (param.jscode) {
		msg = `${msg} jscode:${param.jscode}`;
	}
	if (param.gsecret) {
		msg = `${msg} iv:${param.gsecret.iv}`;
	}
	console.log(msg);

	return callBy(app, method, param);
}

function callBy(obj, method, param) {
	let r = gw[method];

	if (helper.isPage(obj)) {
		let user = getApp().user;

		param.uid = user.uid;
		param.session = user.session;
	}

	console.log(`mp ${method} ${JSON.stringify(param)}`);

	return r.request(param).then(
		v => {
			let d = v.data;

			console.log(`mp ${method} recv obj: ${JSON.stringify(d)}`);

			return (!d || d.error) ? r.fail(obj, d) : r.success(obj, d);
		},
		e => {
			console.log(`mp ${method} recv error: ${JSON.stringify(d)}`);

			return r.fail(obj, e);
		}
	);
}

function randLogin(app) {
	return loginBy(app, "randLogin", {
		jscode: app.login.jscode,
	});
}

function randLoginG(app) {
	return loginBy(app, "randLoginG", {
		jscode: app.login.jscode,
		gsecret: app.login.gsecret,
	});
}

function userLogin(app) {
	return loginBy(app, "userLogin", {
		uid: app.user.uid,
		jscode: app.login.jscode,
	});
}

function userLoginG(app) {
	return loginBy(app, "userLoginG", {
		uid: app.user.uid,
		jscode: app.login.jscode,
		gsecret: app.login.gsecret,
	});
}

function userG(app) {
	return loginBy(app, "userG", {
		uid: app.user.uid,
		session: app.user.session,
		gsecret: app.login.gsecret,
	});
}

const mp = {
	start: (app, page, shareTicket) => {
		app.start.page = page.name;

		if (shareTicket) {
			console.log(`mp start with shareTicket:${shareTicket}`);

			api.getShareInfo(shareTicket).then(v => {
				console.log(`mp getShareInfo: shareTicket:${shareTicket} ==> iv:${v.iv}`);

				let gsecret = {
					iv: v.iv,
					encryptedData: v.encryptedData,
				};
				app.login.gsecret = gsecret;

				start(app, gsecret);
			})
		} else {
			console.log(`mp start without shareTicket`);

			start(app);
		}
	},

	userCheckin: (page, param = { opengid, role, name, students, userInfo }) =>
		callBy(page, "userCheckin", param),

	groupCheckin: (page, param = { gid, role, name, students, userInfo }) =>
		callBy(page, "groupCheckin", param),

	groupGet: (page, param = { gid }) =>
		callBy(page, "groupGet", param),

	groupSync: (page, param = { gid, ver }) =>
		callBy(page, "groupSync", param),

	groupNewAdviser: (page, param = { gid, adviser }) =>
		callBy(page, "groupNewAdviser", param),

	groupDel: (page, param = { gid }) =>
		callBy(page, "groupDel", param),

	groupDelUser: (page, param = { gid, user }) =>
		callBy(page, "groupDelUser", param),

	groupDelStudent: (page, param = { gid, student }) =>
		callBy(page, "groupDelStudent", param),

	payPre: (page, param = { gid, money, time, lease }) =>
		callBy(page, "payPre", param),

	topicNew: (page, param = { gid, type, topic }) =>
		callBy(page, "topicNew", param),

	topicAct: (page, param = { gid, tid, action }) =>
		callBy(page, "topicAct", param),

	topicGet: (page, param = { gid, tid }) =>
		callBy(page, "topicGet", param),

	topicGetOpen: (page, param = { gid }) =>
		callBy(page, "topicGetOpen", param),

	topicGetClosed: (page, param = { gid }) =>
		callBy(page, "topicGetClosed", param),

	topicClose: (page, param = { gid, tid }) =>
		callBy(page, "topicClose", param),

	topicDel: (page, param = { gid, tid }) =>
		callBy(page, "topicDel", param),
};

module.exports = { mp };