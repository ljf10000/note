const m_name = "index";
const app = getApp();

const $ = (name) => require(`../../utils/${name}.js`)[name];
const mp = $("mp");
const api = $("api");

function load(page, options) {
	console.log(`${m_name} onload options:${JSON.stringify(options)}`);

	mp.start(app, app.login.shareTicket);

	let id = setInterval(() => {
		let time = page.data.time;

		page.setData({
			time: time - 1,
		});

		if (time == 0) {
			api.redirectToEx("me");

			clearInterval(id);
		}
	}, 1000);
}

Page({
	name: m_name,
	data: {
		time: 3,
	},

	onLoad: function (options) {
		load(this, options);
	},
})
