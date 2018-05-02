const m_name = "showvote";
const app = getApp();

const $ = (name) => require(`../../utils/${name}.js`)[name];
const pg = $("pg");
const mp = $("mp");

function load(page, options) {
	console.log(`${m_name} onload options:${JSON.stringify(options)}`);
}

Page({
	name: m_name,
	__i_am__: "page",
	
	data: {

	},

	onLoad: function (options) {
		load(this, options);
	},
})