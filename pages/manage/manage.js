// pages/manage/manage.js

const m_name = "manage";
const app = getApp();

const pg = require('../../utils/pg.js').pg;
const mp = require('mp.js').mp;

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
