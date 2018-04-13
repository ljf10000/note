// pages/guide/guide.js
const m_name = "guide";
const include = (name) => require(`../../utils/${name}.js`)[name];

const pg = include("pg");
const mp = include("mp");

const app = getApp();

function page_load(page, options) {
	console.log(`${m_name} onload options:${JSON.stringify(options)}`);

	let opengid = options.opengid;
	if (opengid) {
		page.setData({ opengid });

		console.log(`${m_name} set data:${opengid}`);
	}
}

Page({
	name: m_name,

	data: {
		opengid: "",
	},

	onLoad: function (options) {
		page_load(this, options);
	},
})
