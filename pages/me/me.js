// 进入条件：
// 1. 正常启动，start normal，重定向到 me
//		此时可以邀请，可以选择班级
// 2. 从群组启动，重定向到 me
//		如果onLoad options携带gid，则
//			onReady 时导航到 group 页
//		否则
//			onReady 时导航到 checkin 页

const m_name = "me";
const app = getApp();

const $ = (name) => require(`../../utils/${name}.js`)[name];
const mp = $("mp");
const db = $("db");
const api = $("api");
const res = $("res");

function onLoad(page, options) {
	console.log(`${m_name} onload options:${JSON.stringify(options)}`);

	page.param.load = {
		opengid: options.opengid,
		gid: options.gid,
	};

	wx.showShareMenu({
		withShareTicket: true,
	});
}

function onShow(page) {
	let groups = db.user.getGroups(app.user) || [];

	page.setData({
		"group.groups": groups,
		count: groups.length,
	});
}

function onReady(page) {
	let param = page.param.load; delete page.param.load;

	if (param.opengid) {
		// start from group
		if (param.gid) {
			// user have gid
			api.navigateToEx("group", param);
		} else {
			// user not have gid
			api.navigateToEx("checkin", param);
		}
	}
}

function onShareAppMessage(page, options) {
	console.log(`onShareAppMessage options=${JSON.stringify(options)}`);

	const sharePage = "index";

	return {
		title: res.APP,
		path: `/pages/${sharePage}/${sharePage}?shared=1`,
		success: v => {
			console.log(`share ${sharePage} success v=${JSON.stringify(v)}`);

			mp.start(app, v.shareTickets[0], { invite: true });
		},
		fail: e => {
			console.error(`share ${sharePage} failed e=${e}`);

			api.showModal(res.APP, res.Transfer("invite fail"));
		},
	};
}

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
		onLoad(this, options);
	},

	onShow: function () {
		onShow(this);
	},

	onReady: function () {
		onReady(this);
	},

	evShare: function (ev) {
		console.log(`click share`);
	},

	evGroup: function (ev) {
		let gid = db.user.getFirstGid(app.user);

		api.navigateToEx("group", { gid });
	},

	evClear: function (ev) {
		api.clearStorageSync();
	},

	onShareAppMessage: function (options) {
		return onShareAppMessage(this, options);
	},

	param: {},
})
