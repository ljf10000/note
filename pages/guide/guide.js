// pages/guide/guide.js

const m_name = "guide";
const app = getApp();

const m_db = require('../../utils/db.js');
const db = m_db.db;

Page({

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
		db.page.create(app.pages, this);

		console.log(`${m_name} onload options:${JSON.stringify(options)}`);

		let opengid = options.opengid;
		if (opengid) {
			this.setData({opengid});

			console.log(`${m_name} set data:${opengid}`);
		}
	},

	onReady: function () {

	},

	onShow: function () {

	},

	onHide: function () {

	},

	onUnload: function () {

	},

	onPullDownRefresh: function () {

	},

	onReachBottom: function () {

	},
})