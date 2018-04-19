// pages/group/group.js
const m_name = "group";
const ___ = (name) => require(`../../utils/${name}.js`)[name];

const pg = ___("pg");
const mp = ___("mp");
const db = ___("db");
const api = ___("api");

const app = getApp();

function load(page, options) {
	console.log(`${m_name} onload options:${JSON.stringify(options)}`);

	let gid = options.gid * 1;
	let opengid = options.opengid;

	db.user.addGroup(app.user, gid, opengid);
	db.user.save(app.user);

	page.setData({
		"group.opengid": opengid,
	});

	mp.groupGet(page, {gid});
}

Page({
	name: m_name,
	data: {
		group: {},
	},

	onLoad: function (options) {
		load(this, options);
	},

	groupGet: function(group) {
		this.setData({
			group: group,
		});
	},
})