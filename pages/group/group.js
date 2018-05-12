// 进入条件

const m_name = "group";
const app = getApp();

const $ = (name) => require(`../../utils/${name}.js`)[name];
const pg = $("pg");
const mp = $("mp");
const db = $("db");
const api = $("api");
const res = $("res");

function loadByShared(page, options) {
	let gid = options.gid * 1;
	let opengid = options.opengid || "";

	if (opengid && gid) {
		db.user.addGroup(app.user, gid, opengid);
		db.user.save(app.user);
	}

	if (gid) {
		mp.groupGet(page, { gid });
	}

	page.setData({ opengid });
}

function loadByCheckin(page, options) {
	let gid = options.gid * 1;
	let opengid = options.opengid || "";

	mp.groupGet(page, { gid });
	
	page.setData({ opengid });
}

function loadByGroup(page, options) {
	let gid = options.gid * 1;
	let opengid = db.user.getOpenGid(app.user, gid);
	let group = db.group.load(app.groups, gid);

	groupGet(page, group);

	page.setData({ opengid });
}

function load(page, options) {
	console.log(`${m_name} onload options:${JSON.stringify(options)}`);

	switch (options.event) {
		case "userCheckin":
			loadByCheckin(page, options);
			break;
		case "share":
			loadByShared(page, options);
			break;
		default:
			loadByGroup(page, options);
			break;
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
		"group.teacher.list": teachers,
		"group.patriarch.list": patriarchs,
		"group.student.list": students,
	});
}

function swichTab(page, current) {
	if (page.data.current != current) {
		page.setData({ current });
	}
}

const tabVote = {
	title: res.Word("vote"),
	list: [],
};

const tabNotice = {
	title: res.Word("notice"),
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
		list: [],
	},
	patriarch: {
		label: res.Word("patriarch"),
		list: [],
	},
	student: {
		label: res.Word("student"),
		list: [],
	},
};

Page({
	name: m_name,
	__i_am__: "page",

	data: {
		vote: tabVote,
		notice: tabNotice,
		group: tabGroup,

		winWidth: app.sysinfo.windowWidth,
		winHeight: app.sysinfo.windowHeight,
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