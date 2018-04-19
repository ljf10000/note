// pages/manage/manage.js
const m_name = "manage";
const $ = (name) => require(`../../utils/${name}.js`)[name];

const pg = $("pg");
const mp = $("mp");

const app = getApp();

function load(page, options) {
	console.log(`${m_name} onload options:${JSON.stringify(options)}`);
}

Page({
	name: m_name,
	data: {

	},

	onLoad: function (options) {
		load(this, options);
	},
})
