// pages/index/index.js

const m_name = "index";
const app = getApp();

const m_db = require('../../utils/db.js');
const db = m_db.db;

const m_mp = require('../../utils/mp.js');
const mp = m_mp.mp;

Page({
	data: {
		motto: 'Hello SB',
		user: app.user,
	},

	onLoad: function (options) {
		console.log(`${m_name} onload options:${JSON.stringify(options)}`);

		db.page.create(app.pages, this);

		mp.start(app, { shareTicket: app.shareTicket });
	},
	onUnload: function () {
		db.page.destroy(app.pages, this);
	},

	onShow: function () {
		
	},

	clickShare: function (ev) {
		console.log(`share with ${this.route}`);
	},

	onShareAppMessage: function (options) {
		console.log(`share from ${options.from} to ${options.target}`);

		return {
			title: "try this",
			path: `/${this.route}?shared=1`,
			success: v => {
				let shareTicket = v.shareTickets[0];

				console.info(`${m_name} share success v=${JSON.stringify(v)}`);

				app.shareTicket = shareTicket;

				mp.start(app, { shareTicket  });
			},
			fail: e => {
				console.info(`${m_name} share failed e=${e}`);
			},
		};
	},
})
