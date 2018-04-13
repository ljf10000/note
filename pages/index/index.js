// pages/index/index.js

const m_name = "index";
const app = getApp();

const db = require('../../utils/db.js').db;
const mp = require('../../utils/mp.js').mp;

Page({
	name: m_name,
	data: {
		motto: 'Hello SB',
		user: app.user,
	},

	onLoad: function (options) {
		console.log(`${m_name} onload options:${JSON.stringify(options)}`);

		mp.start(app, app.login.shareTicket);
	},
	onUnload: function () {

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

				mp.start(app, shareTicket);
			},
			fail: e => {
				console.info(`${m_name} share failed e=${e}`);
			},
		};
	},
})
