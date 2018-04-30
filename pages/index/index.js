const m_name = "index";
const app = getApp();

const $ = (name) => require(`../../utils/${name}.js`)[name];
const mp = $("mp");
const api = $("api");

function load(page, options) {
	console.log(`${m_name} onload options:${JSON.stringify(options)}`);

	mp.start(app, app.login.shareTicket);

	let interval = 100;

	let id = setInterval(() => {
		let time = page.data.time;

		page.setData({
			time: time - interval,
		});

		if (time == 0) {
			api.redirectToEx("me");

			clearInterval(id);
		}
	}, interval);
}

Page({
	name: m_name,
	data: {
		time: 2000,
	},

	onLoad: function (options) {
		load(this, options);
	},
})
