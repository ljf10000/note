// pages/vote/vote.js
const m_name = "vote";
const ___ = (name) => require(`../../utils/${name}.js`)[name];

const pg = ___("pg");
const mp = ___("mp");

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