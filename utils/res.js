// res.js

const lang = 0;

function Get(app, id) {
	let obj = $res[id];

	return obj ? obj[lang] : "";
}

function join(app, ...keys) {
	let count = keys.count;
	if (0==count) {
		return ""
	}

	let name = Get(app, keys[0]);
	if (1==count) {
		return name;
	}

	let split = (0==lang)?"":" ";
	for (let i=1; i<count; i++) {
		name += split + Get(app, keys[i]);
	}

	return name
}

const $res = {
	app: ["班级事务小助手", "small assistant in class affairs"],
	success: ["成功", "success"],
	fail: ["失败", "fail"],
	login: ["登陆", "login"],

	wx: ["微信", "webcat"],
	mp: ["小程序", "mini program"],
};

const res = {
	app: (app) => Get(app, "app"),
	
	success: (app) => Get(app, "success"),
	fail: (app) => Get(app, "fail"),
	login: (app) => Get(app, "login"),
	wx: (app) => Get(app, "wx"),
	mp: (app) => Get(app, "mp"),

	wxLogin: (app) => join(app, "wx", "login"),
	mpLogin: (app) => join(app, "mp", "login"),

	wxLoginFail: (app) => join(app, "wx", "login", "fail"),
	mpLoginFail: (app) => join(app, "mp", "login", "fail"),
};

module.exports = {
	res: res,
};
