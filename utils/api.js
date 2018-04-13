// api.js

const helper = require('helper.js').helper;
const deft = require('deft.js').deft;

const api = {
	alert: (content) => api.showModal({ title: "alert", content }),

	getStorageSync: (k) => {
		try {
			return wx.getStorageSync(k);
		} catch (e) {
			console.error(`get storage k:${k} error:${e}`);

			return {};
		}
	},

	setStorageSync: (k, v) => {
		try {
			wx.setStorageSync(k, v);
		} catch (e) {
			console.error(`set storage k:${k} v:${JSON.stringify(v)} error:${e}`);
		}

		return v;
	},

	removeStorageSync: (k) => {
		try {
			wx.removeStorageSync(k);
		} catch (e) {
			console.error(`remove storage k:${k} error:${e}`);
		}
	},

	clearStorageSync: () => {
		try {
			wx.clearStorageSync();
		} catch (e) {
			console.error(`clear storage error:${e}`);
		}
	},

	request: (param = { url, method, data }) => helper.promisify(wx.request, param),

	login: () => helper.promisify(wx.login, { timeout: deft.timeout }),

	checkSession: () => helper.promisify(wx.checkSession),

	authorize: (scope) => helper.promisify(wx.authorize, { scope }),

	getUserInfo: () => helper.promisify(wx.getUserInfo, {
		lang: deft.lang.zhCN,
	}),

	requestPayment: ({ timeStamp, nonceStr, prepay_id, signType = "MD5", paySign }) => {
		let obj = {
			timeStamp,
			nonceStr,
			package: prepay_id,
			signType,
			paySign,
		};

		console.log(`requestPayment data:${JSON.stringify(obj)}`);

		return helper.promisify(wx.requestPayment, obj);
	},

	getShareInfo: (shareTicket, timeout = deft.timeout) => helper.promisify(wx.getShareInfo, {shareTicket,timeout}),

	showLoadingEx: (title, ms = 2000) => wx.showLoading({
		title,
		mask: true,
		success: v => setTimeout(() => wx.hideLoading(), ms),
		fail: e => wx.hideLoading(),
	}),

	hideLoadingEx: () => {
		// wx.hideLoading();
	},

	showModal: (title, content) => helper.promisify(wx.showModal, { title, content }),

	navigateTo: (url) => {
		console.log(`navigateTo url:${url}`);

		return helper.promisify(wx.navigateTo, { url: url });
	},

	redirectTo: (url) => {
		console.log(`redirectTo url:${url}`);

		return helper.promisify(wx.redirectTo, { url: url });
	},

	switchTab: (url) => {
		console.log(`switchTab url:${url}`);

		return helper.promisify(wx.switchTab, { url: url });
	},

	reLaunch: (url) => {
		console.log(`reLaunch url:${url}`);

		return helper.promisify(wx.reLaunch, { url: url });
	},
};


module.exports = {
	api: api,
};
