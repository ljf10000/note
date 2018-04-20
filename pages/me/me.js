const m_name = "me";
const app = getApp();

const $ = (name) => require(`../../utils/${name}.js`)[name];
const pg = $("pg");
const mp = $("mp");
const api = $("api");

Page({
	name: m_name,
	data: {
		name: `Hello ${app.userInfo.nickName}`,
	},

	onLoad: function (options) {
		console.log(`${m_name} onload options:${JSON.stringify(options)}`);
	},

	onShow: function () {
		this.setData({
			motto: `Hello ${app.userInfo.nickName}`,
		});
	},

	evShare: function (ev) {
		console.log(`share with ${this.route}`);
	},

	evGroup: function (ev) {
		api.navigateToEx("group");
	},

	evClear: function (ev) {
		api.clearStorageSync();
	},

	onShareAppMessage: function (options) {
		return pg.share(this, options);
	},
})
