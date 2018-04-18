// res.js

const lang = 0;

function Get(app, key) {
	let obj = $res[key] || $res.unknow;

	return obj[lang] || key;
}

function join(app, ...keys) {
	console.log(`res join: ${keys}`);

	let count = keys.length;
	if (0 == count) {
		return ""
	}

	let name = Get(app, keys[0]);
	if (1 == count) {
		return name;
	}

	let split = (0 == lang) ? "" : " ";
	for (let i = 1; i < count; i++) {
		name += split + Get(app, keys[i]);
	}

	return name
}

const $res = {
	adviser: ["班主任"],
	app: ["班级事务小助手", "small assistant in class affairs"],
	checkin: ["等级"],
	del: ["删除"],
	fail: ["失败"],
	["get"]: ["获取"],
	group: ["群组"],
	login: ["登陆"],
	["new"]: ["创建"],
	pay: ["支付"],
	pre: ["预先"],
	student: ["学生"],
	success: ["成功"],
	sync: ["同步"],
	topic: ["主题"],
	unknow: ["未知"],
	user: ["用户"],

	wx: ["微信", "webcat"],
	mp: ["小程序", "mini program"],
};

const res = {
	app: (app) => Get(app, "app"),
	join: (app, ...keys) => join(app, ...keys),
	info: (app, desc) => {
		let keys = desc.split(" ");

		return join(app, ...keys);
	},
};

module.exports = {
	res: res,
};
