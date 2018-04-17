// pages/guide/guide.js
const m_name = "guide";
const include = (name) => require(`../../utils/${name}.js`)[name];

const pg = include("pg");
const gw = include("gw");
const mp = include("mp");
const api = include("api");

const app = getApp();

const roles = [
	"patriarch",
	"adviser",
	"teacher",
];

function page_load(page, options) {
	console.log(`${m_name} onload options:${JSON.stringify(options)}`);

	let opengid = options.opengid;
	if (opengid) {
		page.setData({ opengid });

		console.log(`${m_name} set data opengid:${opengid}`);
	}
}

Page({
	name: m_name,

	data: {
		opengid: "",

		role: {
			patriarch: 0,
			indexs: [0],
			values: roles,
		},
		name: "",
		students: [
			{
				name: "name0",
				sex: gw.sex.man,
				relation: "relation0",
			},
		],

		studentCount: 1,
	},

	onLoad: function (options) {
		page_load(this, options);
	},

	bindRoleChange: function (ev) {
		let oldRoleIndex = this.data.role.indexs[0];
		let newRoleIndex = ev.detail.value[0] * 1;

		console.log(`role change from ${roles[oldRoleIndex]} to ${roles[newRoleIndex]}`);

		this.setData({
			["role.indexs[0]"]: newRoleIndex,
		});
	},
	checkin: function (ev) {
		let d = this.data;

		console.log(`checkin ${JSON.stringify(ev)}`);

		mp.userCheckin(this, {
			opengid: d.opengid,
			role: d.role,
			name: d.name,
			nick: "", // todo: get nick-name
			students: d.students,
		});
	},

	addStudent: function (ev) {
		console.log(`addStudent ${JSON.stringify(ev)}`);

		// todo: save current

		let students = this.data.students;
		let count = students.length;
		let current = students[count - 1];

		this.setData({
			[`students[${count}]`]: {
				name: "name" + count,
				relation: "relation" + count,
			},
			"studentCount": count + 1,
		});
	},

	delStudent: function (ev) {
		console.log(`delStudent ${JSON.stringify(ev)}`);

		let students = [];
		for (let obj of this.data.students) {
			students.push({
				name: obj.name,
				relation: obj.relation,
			})
		}

		students.pop();

		this.setData({
			"studentCount": students.length,
			"students": students,
		});
	},
})
