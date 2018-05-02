// app.js
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

const pages = [
	"checkin",
	"group",
	"index",
	"me",
	"notice",
	"vote",
];

function load(app, options) {
	console.log(`app launch options=${JSON.stringify(options)}`);

	console.log(`now=${helper.simTimeString()}/${helper.stdTimeString()}`);

	pages.map(v => app.mq.addTopic(v));

	api.getUserInfoEx(app);

	db.user.load(app.user);
	Object.values(app.user.byname).map(gid => {
		db.group.load(app.groups, gid);
	});
}

function show(app, options) {
	app.options = options;

	if (1044 == app.options.scene) {
		let login = app.login;

		login.shareTicket = options.shareTicket;
		login.query = options.query;
	}

	console.log(`app show options=${JSON.stringify(options)}`);
}

App({
	onLaunch: function (options) {
		load(this, options);
	},

	onShow: function (options) {
		show(this, options);
	},

	user: {},
	groups: {},
	userInfo: {
		nickName: "SB",
	},

	login: {},
	options: {},

	mq: new mq(),
	__i_m_app__: true,
});
