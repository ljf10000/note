// app.js

const db = require('utils/db.js').db;
const mp = require('utils/mp.js').mp;
const mq = require('utils/mq.js').mq;

function app_load(app, options) {
	let names = [
		"group",
		"guide",
		"index",
		"list",
		"manage",
		"notice",
		"vote",
	];

	console.log(`app launch options=${JSON.stringify(options)}`);

	names.map(v => app.mq.addTopic(v));

	// load user
	// todo: load group
	db.user.load(app.user);

	wx.showShareMenu({
		withShareTicket: true
	});
}

function app_show(app, options) {
	app.options = options;
	app.login.shareTicket = options.shareTicket;

	console.log(`app show options=${JSON.stringify(options)}`);
}

App({
	onLaunch: function (options) {
		app_load(this);
	},

	onShow: function (options) {
		app_show(this, options);
	},

	lang: 0,
	user: {},
	groups: {},
	login: {},
	pages: {},
	options: {},
	mq: new mq(),
});
