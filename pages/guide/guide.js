// pages/guide/guide.js
const m_name = "guide";
const include = (name) => require(`../../utils/${name}.js`)[name];

const pg = include("pg");
const gw = include("gw");
const mp = include("mp");
const api = include("api");

const app = getApp();

const roles = [
	"invalid",
	"adviser",
	"teacher",
	"patriarch",
];

function page_load(page, options) {
	console.log(`${m_name} onload options:${JSON.stringify(options)}`);

	let opengid = options.opengid;
	if (opengid) {
		page.setData({ opengid });

		console.log(`${m_name} set data opengid:${opengid}`);
	}
}

Page({
	name: m_name,

	data: {
		opengid: "",

		checkin: `{
	"role": 3,
	"name": "大明",
	"students": [
		{
			"name": "小明",
			"sex": 1,
			"relation": "爸爸"
		}
	]
}`,
	},

	onLoad: function (options) {
		page_load(this, options);
	},

	checkin: function (ev) {
		let v = ev.detail.value.checkin;
		let d = JSON.parse(v);
		let obj = {
			opengid: this.data.opengid,
			role: d.role,
			name: d.name,
			students: d.students,
			userInfo: app.userInfo,
		};

		console.log(`checkin ${JSON.stringify(d)}`);

		mp.userCheckin(this, obj);
	},
})
