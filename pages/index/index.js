// pages/index/index.js
const m_name = "index";
const include = (name) => require(`../../utils/${name}.js`)[name];

const pg = include("pg");
const mp = include("mp");

const app = getApp();

function load(page, options) {
	console.log(`${m_name} onload options:${JSON.stringify(options)}`);

	mp.start(app, app.login.shareTicket);
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
