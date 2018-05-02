// pages/group/group.js
const m_name = "group";
const app = getApp();

const $ = (name) => require(`../../utils/${name}.js`)[name];
const pg = $("pg");
const mp = $("mp");
const db = $("db");
const api = $("api");
const res = $("res");

function load(page, options) {
	console.log(`${m_name} onload options:${JSON.stringify(options)}`);

	let gid = options.gid * 1;
	let opengid = options.opengid;

	if (opengid && gid) {
		db.user.addGroup(app.user, gid, opengid);
		db.user.save(app.user);

		page.data.opengid = opengid;
	}

	if (gid) {
		mp.groupGet(page, { gid });
	}
}

function swichTab(page, current) {
	if (page.data.current != current) {
		page.setData({ current });
	}
}

function groupGet(page, obj) {
	let gid = obj.gid;
	let group = obj.group;
	let d = page.data;
	let adviser = { name: "" };
	let teachers = [];
	let patriarchs = [];
	let students = [];

	db.group.save(app.groups, gid, group);

	console.log(`group=${JSON.stringify(group)}`);

	if (group.teachers) {
		if (group.adviser) {
			let teacher = group.teachers[group.adviser + ""];

			adviser.name = teacher.name;
			adviser.xid = group.adviser;
		}

		Object.keys(group.teachers).map((uid, idx) => {
			// skip adviser
			if ((uid * 1) != group.adviser) {
				let teacher = group.teachers[uid];

				teachers.push({
					name: teacher.name,
					xid: uid * 1,
				});
			}
		});
	}

	if (group.patriarchs) {
		Object.keys(group.patriarchs).map((uid, idx) => {
			let patriarch = group.patriarchs[uid];

			patriarchs.push({
				name: patriarch.name,
				xid: uid * 1,
			});
		});

		Object.keys(group.students).map((sid, idx) => {
			let student = group.students[sid];

			students.push({
				name: student.name,
				xid: sid * 1,
			});
		});
	}

	page.setData({
		"group.adviser.obj": adviser,
		"group.teacher.all": teachers,
		"group.patriarch.all": patriarchs,
		"group.student.all": students,
	});
}

const tabVote = {
	list: [],
};

const tabNotice = {
	list: [],
};

const tabGroup = {
	title: res.Transfer("class member"),

	opengid: "",

	adviser: {
		label: res.Word("adviser"),
		obj: {},
	},
	teacher: {
		label: res.Word("teacher"),
		all: [
			// {idx: idx, name: name},
		],
	},
	patriarch: {
		label: res.Word("patriarch"),
		all: [
			// {idx: idx, name: name},
		],
	},
	student: {
		label: res.Word("student"),
		all: [
			// {idx: idx, name: name},
		],
	},
};

Page({
	name: m_name,
	data: {
		vote: tabVote,
		notice: tabNotice,
		group: tabGroup,

		/** 
		* 页面配置
		*/
		winWidth: 0,
		winHeight: 0,
		current: 2,
	},

	onLoad: function (options) {
		load(this, options);

		let info = api.getSystemInfoSync();

		this.setData({
			winWidth: info.windowWidth,
			winHeight: info.windowHeight,
		});
	},

	groupGet: function (obj) {
		return groupGet(this, obj);
	},

	bindChange: function (e) {
		swichTab(this, e.detail.current);
	},

	swichTab: function (e) {
		swichTab(this, e.target.dataset.current);
	},
})