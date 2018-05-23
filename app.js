const $ = (name) => require(`utils/${name}.js`)[name];
const helper = $("helper");
const api = $("api");
const db = $("db");
const mp = $("mp");
const mq = $("mq");

/*
const updateManager = wx.getUpdateManager();

updateManager.onCheckForUpdate(v => console.log(`hasUpdate=${v.hasUpdate}`))

updateManager.onUpdateReady(function () {
	console.log(`update ready, apply update`);

	updateManager.applyUpdate();
})

updateManager.onUpdateFailed(function () {
	// 新的版本下载失败
})
*/

const sysinfo = api.getSystemInfoSync();

const topics = [
	"checkin",
	"group",
	"index",
	"me",
	"newvote",
	"newnotice",
	"showvote",
	"shownotice",
];

function onLaunch(app, options) {
	console.log(`app launch options=${JSON.stringify(options)}`);

	/*
	if (!app.userInfo.nickName) {
		api.getUserInfoEx(app);
	}
	*/

	topics.map(v => app.mq.addTopic(v));

	db.user.load(app.user);

	Object.values(app.user.byname).map(gid => {
		db.group.load(app.groups, gid);
	});
}

function onShow(app, options) {
	console.log(`app show options=${JSON.stringify(options)}`);

	app.options = options;

	switch (app.options.scene) {
		// 群内打开带share ticket的小程序
		case api.sence.shareTicket:
			app.login.shareTicket = options.shareTicket;
			break;
	}
}

App({
	onLaunch: function (options) {
		onLaunch(this, options);
	},

	onShow: function (options) {
		onShow(this, options);
	},

	user: {},
	groups: {},
	userInfo: api.getStorageSync("userInfo") || {},
	sysinfo,

	login: {
		// shareTicket
	},
	start: {
		// page
		// gsecret
		// jscode
	},
	options: {},

	mq: new mq(),
	name: "app",
	__i_am__: "app",
});
