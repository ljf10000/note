// api.js
const helper = require('helper.js').helper;
const deft = require('deft.js').deft;

const api = {
	sence: {
		found: 1001, 				// 发现栏小程序主入口
		topSearch: 1005, 			// 顶部搜索框的搜索结果页
		foundSearch: 1006,			// 发现栏小程序主入口搜索框的搜索结果页
		peerChatMpCard: 1007,		// 单人聊天会话中的小程序消息卡片
		groupChatMpCard: 1008,		// 群聊会话中的小程序消息卡片
		/*
		scanQR: 1011,				// 扫描二维码
		pictureQR: 1012,			// 长按图片识别二维码
		*/
		topChat: 1022,				// 聊天顶部置顶小程序入口
		shareTicket: 1044,			// 带 shareTicket 的小程序消息卡片
		scanMpQR: 1047,				// 扫描小程序码
		pictureMpQR: 1048, 			// 长按图片识别小程序码
		albemMpQR: 1049,			// 手机相册选取小程序码
		scanScanResult: 1053,		// 搜一搜的结果页
		wxTop: 1089,				// 微信聊天主界面下拉
	},

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
		timeout: deft.timeout,
	}),

	getUserInfoEx: (app) => api.getUserInfo().then(v => {
		Object.assign(app.userInfo, v.userInfo);

		console.log(`getUserInfoEx=${JSON.stringify(app.userInfo)}`);
	}),

	requestPayment: ({ timeStamp, nonceStr, prepay_id, signType = "MD5", paySign }) => {
		let obj = {
			timeStamp,
			nonceStr,
			package: `prepay_id=${prepay_id}`,
			signType,
			paySign,
		};

		console.log(`requestPayment data:${JSON.stringify(obj)}`);

		return helper.promisify(wx.requestPayment, obj);
	},

	getShareInfo: (shareTicket, timeout = deft.timeout) =>
		helper.promisify(wx.getShareInfo, { shareTicket, timeout }),

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

	navigateToEx: (name, param = {}) => {
		let url = helper.url(name, param);

		return api.navigateTo(url);
	},

	redirectTo: (url) => {
		console.log(`redirectTo url:${url}`);

		return helper.promisify(wx.redirectTo, { url: url });
	},

	redirectToEx: (name, param = {}) => {
		let url = helper.url(name, param);

		return api.redirectTo(url);
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
