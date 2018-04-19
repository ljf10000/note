// pages/group/group.js
const m_name = "group";
const include = (name) => require(`../../utils/${name}.js`)[name];

const pg = include("pg");
const mp = include("mp");
const db = include("db");
const api = include("api");

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
		groupstr: "",
	},

	onLoad: function (options) {
		load(this, options);
	},

	groupGet: function(group) {
		this.setData({
			group: group,
			groupstr: JSON.stringify(group),
		});
	},
})