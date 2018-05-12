const m_name = "guide";
const app = getApp();

const $ = (name) => require(`../../utils/${name}.js`)[name];
const pg = $("pg");
const gw = $("gw");
const mp = $("mp");
const api = $("api");
const res = $("res");

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

function roleChange(page, ev) {
	console.log(`roleChange ${JSON.stringify(ev)}`);
	let oldRole = page.data.role;
	let newRole = ev.detail.value * 1;

	page.setData({ role: newRole });

	console.log(`oldRole[${oldRole}] ==> newRole[${newRole}]`);
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

function saveName(page, ev) {
	let v = ev.detail.value;

	if (v) {
		page.setData({ name: v });
	}
}

function checkin(page, ev) {
	let d = page.data;
	if (!d.name) {
		api.showModal("", res.Transfer("please fill name"));
		return 0;
	}

	let students = [];
	let count = d.students.length;
	for (let i = 0; i < count; i++) {
		let student = d.students[i];

		if (!student.name.v && !student.relation.v) {
			continue;
		}

		if (!student.name.v) {
			api.showModal("", res.Transfer("please fill student name"));
			return 0;
		}

		if (!student.relation.v) {
			api.showModal("", res.Transfer("please fill student relation"));
			return 0;
		}

		students.push({
			name: student.name.v,
			relation: student.relation.v,
			sex: 0,
		});
	}

	if (0 == students.length) {
		api.showModal("", res.Transfer("please fill student name and relation"));
		return 0;
	}

	mp.userCheckin(page, {
		opengid: d.opengid,
		role: d.role,
		name: d.name,
		students: students,
		userInfo: app.userInfo,
	});
}

function load(page, options) {
	console.log(`${m_name} onload options:${JSON.stringify(options)}`);

	let opengid = options.opengid;
	if (opengid) {
		page.setData({ opengid });

		console.log(`${m_name} set data opengid:${opengid}`);
	}
}

Page({
	name: m_name,
	__i_am__: "page",

	data: {
		opengid: "",

		roles: [
			{ k: 1, v: res.Word("adviser") },
			{ k: 2, v: res.Word("teacher") },
			{ k: 3, v: res.Word("patriarch"), checked: true },
		],
		students: [
			newStudent(0, res.Word("bear1"), res.Word("mother")),
			newStudent(1, res.Word("bear2"), res.Word("mother")),
			newStudent(2, res.Word("panda"), res.Word("father")),
		],
		role: 3,
		name: "",
	},

	onLoad: function (options) {
		load(this, options);
	},

	roleChange: function (ev) {
		roleChange(this, ev);
	},

	saveName: function (ev) {
		saveName(this, ev);
	},

	saveStudent: function (ev) {
		saveStudent(this, ev);
	},

	checkin: function (ev) {
		checkin(this, ev);
	},
})
