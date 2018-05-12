// 进入条件：启动

const m_name = "index";
const app = getApp();

const $ = (name) => require(`../../utils/${name}.js`)[name];
const mp = $("mp");
const api = $("api");
const res = $("res");

function load(page, options) {
	console.log(`${m_name} onload options:${JSON.stringify(options)}`);

	mp.start(app, page, app.login.shareTicket);
}

Page({
	name: m_name,
	__i_am__: "page",
	
	data: {
		APP: res.APP,
	},

	onLoad: function (options) {
		load(this, options);
	},
})
