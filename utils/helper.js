// helper.js

const helper = {
	bkdr: (s) => {
		let n = 0;

		for (let i = 0; i < s.length; i++) {
			let c = s.charCodeAt(i);

			n = (n * 37 + c) >>> 0;
		}

		return n >>> 0;
	},

	im: obj => obj.__i_am__ || "",
	isApp: obj => obj.__i_am__ == "app",
	isPage: obj => obj.__i_am__ == "page",

	url: (name, param = {}) => {
		let url = `/pages/${name}/${name}`;
		let keys = Object.keys(param);
		let count = keys.length;

		if (count) {
			for (let i = 0; i < count; i++) {
				let k = keys[i];
				let v = param[k];

				if (0 == i) {
					url = `${url}?${k}=${v}`;
				} else {
					url = `${url}&${k}=${v}`;
				}
			}
		}

		return url;
	},

	promisify: (fn, obj = {}) => new Promise((resolve, reject) => {
		obj.success = resolve;
		obj.fail = reject;

		fn(obj);
	}),

	// obj[key] is array
	delElement: (obj, key, idx) => {
		let old = obj[key];
		if (idx < 0 | idx >= old.length) {
			throw `delete element with count ${old.length} by index[${idx}]`;
		}

		let a = [];

		old.map((v, i) => i == idx || a.push(v))

		obj[key] = a;

		return a;
	},

	timeFormat: (split, ...list) => {
		let [head, ...tail] = list;
		let init = (head < 10) ? ("0" + head) : ("" + head);

		return tail.reduce((pre, v) => {
			let pad = (v < 10) ? "0" : "";

			return `${pre}${split}${pad}${v}`;
		}, init);
	},

	dateString: (date, split = "") => {
		date = date || new Date();

		return helper.timeFormat(split, date.getFullYear(), 1 + date.getMonth(), date.getDay());
	},

	timeString: (date, split = "") => {
		date = date || new Date();

		return helper.timeFormat(split, date.getHours(), date.getMinutes(), date.getSeconds());
	},

	fullTimeString: (date, splits) => {
		let sdate = helper.dateString(date, splits[0]);
		let stime = helper.timeString(date, splits[2]);

		return `${sdate}${splits[1]}${stime}`;
	},

	stdTimeString: (date) => helper.fullTimeString(date, ["-", " ", ":"]),
	simTimeString: (date) => helper.fullTimeString(date, ["", "", ""]),

	addDay: (date, after) => {
		date = date || new Date();
		date = new Date(date.getFullYear(), date.getMonth(), date.getDay());

		let unix = date.getTime() / 1000 + (1 + after) * 3600 * 24 - 1;

		return new Date(1000 * unix);
	},

	stdNowString: () => helper.stdTimeString(new Date()),
	simNowString: () => helper.simTimeString(new Date()),
	addNowDay: (after) => helper.addDay(new Date(), after),
};

console.log(`now=[${helper.simTimeString()}]/[${helper.stdTimeString()}]`);

/*
const fsm = {
	INIT: 0,
	NORMAL: 1,
	WX_LOGIN_FAIL: 2,
	MP_LOGIN_FAIL: 3,
	NORMAL_G: 4,
	RAND_LOGIN: 5,
	RAND_LOGIN_G: 6,
	USER_LOGIN: 7,
	USER_LOGIN_G: 8,
};
*/

/*
const typedef = {
	user: {
		uid: 0,
		session: "",
		nn: 4,
		groups: [0],
	},
	secret: {
		encryptedData: "",
		iv: "",
	},
	lease: {
		begin: 0,
		end: 0,
	},
	group: {
		ver: 0,
		opengid: "",
		adviser: 0,
		payer: 0,
		lease: {},
		create: 0,
		students: {},
		teachers: {},
		patriarchs: {},
	},
	checkinStudents: {
		name: "",
		relation: "",
		sgw: 0,
	},
	student: {
		name: "",
		sgw: 0,
		relation: {},
	},
	teacher: {
		name: "",
		nick: "",
	},
	patriarch: {
		name: "",
		nick: "",
		relation: {},
	},
	$topic: {
		creater: 0,
		create: 0,
		begin: 0,
		end: 0,
		state: 0,
		title: "",
		content: "",
		body: {},
	},
	$topicx: {
		tid: 0,
		$topic: {},
		actions: [{}],
	},
	$topicAction: {
		uid: 0,
		time: 0,
		action: {},
	},
	$topicSummary: {
		summary: {},
	},
	pay: {
		timeStamp: "",
		nonceStr: "",
		package: "",
		signType: "",
		paySign: "",
	},
};
*/

module.exports = { helper };
