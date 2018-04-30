// res.js

let lang = 0;

const $words = {
	app: ["班级事务小助手", "small assistant in class affairs"],
	wx: ["微信", "webcat"],
	mp: ["小程序", "mini program"],

	adviser: ["班主任"],
	and: ["和"],

	bear1: ["熊大"],
	bear2: ["熊二"],

	checkin: ["等级"],
	["class"]: ["班级"],
	closed: ["已关闭"],

	del: ["删除"],

	fail: ["失败"],
	father: ["爸爸"],
	fill: ["填写"],

	["get"]: ["获取"],
	group: ["群组"],

	ing: ["进行中"],

	login: ["登陆"],

	member: ["成员"],
	mother: ["妈妈"],

	name: ["名字"],
	["new"]: ["创建"],
	notice: ["通知"],

	panda: ["熊猫"],
	patriarch: ["家长"],
	pay: ["支付"],
	please: ["请"],
	pre: ["预先"],

	relation: ["关系"],

	student: ["学生"],
	success: ["成功"],
	sync: ["同步"],

	teacher: ["老师"],
	topic: ["主题"],

	unknow: ["未知"],
	user: ["用户"],
	
	vote: ["投票"],
};

function word(words, key) {
	words = words || $words;
	
	let obj = words[key] || words.unknow;

	return obj[lang] || key;
}

function join(words, ...keys) {
	console.log(`res join: ${keys}`);

	let count = keys.length;
	if (0 == count) {
		return ""
	}

	let name = word(words, keys[0]);
	if (1 == count) {
		return name;
	}

	let split = (0 == lang) ? "" : " ";
	for (let i = 1; i < count; i++) {
		name += split + word(words, keys[i]);
	}

	return name;
}

function transfer(words, sentence) {
	let keys = sentence.split(" ");

	return join(words, ...keys);
}

const APP = word($words, "app");

const res = {
	word,
	join,
	transfer,

	APP,

	Word: (key) => word($words, key),
	Join: (...keys) => join($words, ...keys),
	Transfer: (sentence) => transfer($words, sentence),
};

module.exports = {
	res: res,
};
