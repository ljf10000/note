// pages/guide/guide.js
const m_name = "guide";
const include = (name) => require(`../../utils/${name}.js`)[name];

const pg = include("pg");
const gw = include("gw");
const mp = include("mp");
const api = include("api");

const app = getApp();

const roles = [
	{ k: 1, v: "adviser" },
	{ k: 2, v: "teacher" },
	{ k: 3, v: "patriarch", checked: true },
];

function newStudent(k, name, relation) {
	return {
		k,
		name: {
			v: "",
			example: name,
		},
		relation: {
			v: "",
			example: relation,
		},
	};
}

function roleChange (page, ev) {
	console.log(`roleChange ${JSON.stringify(ev)}`);
	let oldRole = page.data.role;
	let newRole = ev.detail.value * 1;

	page.setData({
		role: newRole,
	});

	console.log(`oldRole[${oldRole}] ==> newRole[${newRole}]`);
}

function page_load(page, options) {
	console.log(`${m_name} onload options:${JSON.stringify(options)}`);

	let opengid = options.opengid;
	if (opengid) {
		page.setData({ opengid });

		console.log(`${m_name} set data opengid:${opengid}`);
	}
}

function saveStudent(page, ev) {
	let field = ev.target.dataset.field;
	let k = ev.target.dataset.index * 1;
	let v = ev.detail.value;
	let count = page.data.students.length;

	if (v && k >= 0 && k < count) {
		let old = page.data.students[k][field].v;

		page.setData({
			[`students[${k}].${field}.v`]: v,
		});

		console.log(`change students[${k}].${field} [${old}] ==> [${v}]`);
	}
}

function checkin(page, ev) {
	let d = page.data;

	if (!d.name) {
		api.showModal("", "请填写名字");
		return 0;
	}

	let students = [];
	let count = d.students.length;
	for (let i=0; i<count; i++) {
		let student = d.students[i];

		if (!student.name.v && !student.relation.v) {
			continue;
		}
		
		if (!student.name.v) {
			api.showModal("", "请填写学生名字");
			return 0;
		}

		if (!student.relation.v) {
			api.showModal("", "请填写学生关系");
			return 0;
		}

		students.push({
			name: student.name.v,
			relation: student.relation.v,
			sex: 0,
		});
	}

	if (0 == students.length) {
		api.showModal("", "请填写学生姓名和关系");
		return 0;
	}

	let obj = {
		opengid: d.opengid,
		role: d.role,
		name: d.name,
		students: students,
		userInfo: app.userInfo,
	};

	console.log(`checkin ${JSON.stringify(obj)}`);

	mp.userCheckin(page, obj);
}

Page({
	name: m_name,

	data: {
		opengid: "",

		roles: roles,
		students: [
			newStudent(0, "熊大", "妈妈"),
			newStudent(1, "熊二", "妈妈"),
			newStudent(2, "熊宝宝", "妈妈"),
			newStudent(3, "熊猫", "妈妈"),
		],
		role: 3,
		name: "",
	},

	onLoad: function (options) {
		page_load(this, options);
	},

	roleChange: function (ev) {
		roleChange(this, ev);
	},

	saveName: function(ev) {
		let v = ev.detail.value;

		if (v) {
			this.setData({ name: v});
		}
	},

	saveStudent: function (ev) {
		saveStudent(this, ev);
	},

	checkin: function (ev) {
		checkin(this, ev);
	},
})
