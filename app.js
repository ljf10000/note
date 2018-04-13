// app.js

const db = require('utils/db.js').db;
const mp = require('utils/mp.js').mp;

App({
	onLaunch: function (options) {
		console.log(`app launch options=${JSON.stringify(options)}`);

		// load user
		// todo: load group
		db.user.load(this.user);

		wx.showShareMenu({
			withShareTicket: true
		});
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
});
