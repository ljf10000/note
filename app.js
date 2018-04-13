// app.js

const m_db = require('utils/db.js');
const m_mp = require('utils/mp.js');

const db = m_db.db;
const mp = m_mp.mp;

App({
	onLaunch: function (options) {
		this.shareTicket = options.shareTicket;

		console.log(`app launch options=${JSON.stringify(options)}`);

		// load user
		// todo: load group
		db.user.load(this.user);

		wx.showShareMenu({
			withShareTicket: true
		});
	},
	onShow: function (options) {
		this.shareTicket = options.shareTicket;

		console.log(`app show options=${JSON.stringify(options)}`);
	},

	onHide: function () {
		console.log("hide")
	},

	onError: function (msg) {
		console.log(msg)
	},

	globalData: {
		userInfo: null,
		Hello: "Hello",
	},

	lang: 0,
	user: {},
	groups: {},
	pages: {},
	options: undefined,

	getPage: (name) => {
		let pages = getCurrentPages();
		let path = `pages/${name}/${name}`

		for (let page in pages) {
			if (page.route == path) {
				return page;
			}
		}

		return undefined;
	},
});
