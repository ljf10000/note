// deft.js

const deft = {
	test: true,
	timeout: {
		min: 3000,
		max: 30000,
		load: 3000,
		normal: 10000,
		request: 10000,
		login: 15000,
	},
	lang: {
		zhCN: "zh_CN",
		en: "en",
	},
	pay: {
		state: {
			ok: 0,
			fail: 1,
			cancel: 2,
		}
	},
};

module.exports = { deft };
