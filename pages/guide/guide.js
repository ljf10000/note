// pages/guide/guide.js

const m_name = "guide";
const app = getApp();

const db = require('../../utils/db.js').db;


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
	/**
	 * 页面的初始数据
	 */
	data: {
		opengid: "",
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		page_load(this, options);
	},
})
