// app.js

const db = require('utils/db.js').db;
const mp = require('utils/mp.js').mp;
const mq = require('utils/mq.js').mq;

function app_init(app, options) {
	console.log(`app launch options=${JSON.stringify(options)}`);

	[
		"checkin",
		"group",
		"guide",
		"index",
		"list",
		"logs",
	].map(v => app.mq.addTopic(v));

	// load user
	// todo: load group
	db.user.load(app.user);

	wx.showShareMenu({
		withShareTicket: true
	});
}

App({
	onLaunch: function (options) {
		app_init(this);

	},
	onShow: function (options) {
		this.login.shareTicket = options.shareTicket;

		console.log(`app show options=${JSON.stringify(options)}`);
	},

	onHide: function () {
		console.log("hide")
	},

	onError: function (msg) {
		console.log(msg)
	},

	lang: 0,
	user: {},
	groups: {},
	login: {},
	pages: {},
	mq: new mq(),
});
