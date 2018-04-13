// pages/index/index.js

const m_name = "index";
const app = getApp();

const db = require('../../utils/db.js').db;
const mp = require('../../utils/mp.js').mp;

function page_load(page, options) {
	console.log(`${m_name} onload options:${JSON.stringify(options)}`);

	let shareTicket = (1044 == app.options.scene) ? app.login.shareTicket : undefined;

	mp.start(app, shareTicket);
}

function page_share(page, options) {
	console.log(`share from ${options.from} to ${options.target}`);

	return {
		title: "try this",
		path: `/${page.route}?shared=1`,
		success: v => {
			let shareTicket = v.shareTickets[0];

			console.info(`${m_name} share success v=${JSON.stringify(v)}`);

			mp.start(app, shareTicket);
		},
		fail: e => {
			console.info(`${m_name} share failed e=${e}`);
		},
	};
}

Page({
	name: m_name,
	data: {
		motto: 'Hello SB',
		user: app.user,
	},

	onLoad: function (options) {
		page_load(this, options);
	},

	onShareAppMessage: function (options) {
		return page_share(this, options);
	},

	clickShare: function (ev) {
		console.log(`share with ${this.route}`);
	},
})
