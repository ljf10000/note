const m_name = "me";
const app = getApp();

const $ = (name) => require(`../../utils/${name}.js`)[name];
const pg = $("pg");
const mp = $("mp");
const db = $("db");
const api = $("api");
const res = $("res");

Page({
	name: m_name,
	__i_am__: "page",

	data: {
		group: {
			title: res.Word("class"),
			groups: [],
			count: 0,
		},
		invite: {
			title: res.Word("invite"),
		},
		repair: {
			title: res.Word("repair"),
		},

		name: `Hello ${app.userInfo.nickName}`,
	},

	onLoad: function (options) {
		console.log(`${m_name} onload options:${JSON.stringify(options)}`);

		wx.showShareMenu({
			withShareTicket: true,
		});
	},

	onShow: function () {
		let name = `Hello ${app.userInfo.nickName}`;
		let groups = db.user.getGroups(app.user) || [];

		this.setData({
			name,
			"group.groups": groups,
			count: groups.length,
		});
	},

	evShare: function (ev) {
		console.log(`share with ${this.route}`);
	},

	evGroup: function (ev) {
		let gid = db.user.getFirstGid(app.user);

		api.navigateToEx("group", { gid });
	},

	evClear: function (ev) {
		api.clearStorageSync();
	},

	onShareAppMessage: function (options) {
		return pg.share(this, options);
	},
})
