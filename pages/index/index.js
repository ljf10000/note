// pages/index/index.js

const m_name = "index";
const app = getApp();

const pg = require('../../utils/pg.js').pg;
const mp = require('mp.js').mp;

function load(page, options) {
	console.log(`${m_name} onload options:${JSON.stringify(options)}`);

	let shareTicket = (1044 == app.options.scene) ? app.login.shareTicket : undefined;

	mp.start(app, shareTicket);
}

Page({
	name: m_name,
	data: {
		motto: 'Hello SB',
		user: app.user,
	},

	onLoad: function (options) {
		load(this, options);
	},

	onShareAppMessage: function (options) {
		return pg.share(this, options);
	},

	clickShare: function (ev) {
		console.log(`share with ${this.route}`);
	},
})
