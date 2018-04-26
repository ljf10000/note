const $ = (name) => require(`${name}.js`)[name];
const helper = $("helper");
const res = $("res");
const tp = $("tp");

const app = getApp();

function GwOption(content = "") {
	return { content };
}

function MpOption(content, checked = false) {
	return {
		content,		// string
		checked: false, // bool, just for checkin
		selected: 0,	// int, just for show
	};
}

function MpUser(uid, subjects = [], time = helper.simNowString()) {
	return {
		uid,			// UID
		time,			// TimeString
		subjects,		// selection array
	};
}

function Subject(multi, title, options = []) {
	return {
		multi,		// bool
		title,		// string
		options,	// GwOption or MpOption array
	};
}

function GwTopic() {
	return tp.GwTopic([]);
}

function makeSelection(subject) {
	let s = "";

	// 选项索引 0,1,2,3......
	// 将选择的选项索引作为字符串 push 到 selection 中，表明用户的选择
	subject.options.map((opt, idx) => {
		if (opt.checked) {
			s += idx + "";
		}
	});

	return s;
}

function makeGwAction(mpTopic) {
	let a = [];

	mpTopic.subjects.map(sub => a.push(makeSelection(sub)));

	return a;
}

function body$subjects(objs) {
	let a = [];

	objs.map(obj => {
		let options = [];

		obj.options.map(opt => options.push(GwOption(opt.content)));

		a.push(Subject(obj.multi, obj.title, options));
	});

	return a;
}

function makeGwBody(mpTopic) {
	return body$subjects(mpTopic.subjects);
}

function makeMpSubjects(gwTopic) {
	return body$subjects(gwTopic.body);
}

function makeMpTopicx(gwTopicx) {
	let type = tp.tid.type(gwTopicx.tid);
	let tpid = tp.tid.tpid(gwTopicx.tid);
	let users = {};

	// all user's action ==> users
	gwTopicx.actions.map(gwAction => {
		let user = MpUser(gwAction.uid, [], gwAction.time);
		/*
		type GwTopicAction struct {
			Uid    uint32      `json:"uid"`
			Time   string      `json:"time"`
			Action interface{} `json:"action"`
		}
		*/
		gwAction.action.map(selection => user.action.push(selection));

		users[gwAction.uid + ""] = user;
	});

	let mpTopic = makeMpTopic(type, gwTopicx.topic);

	Object.keys(users).map(uid => {
		users[uid].action.map((selection, i) => {
			for (let j of selection) {
				mpTopic.subjects[i].options[j].selected++;
			}
		});
	});

	return tp.MpTopicx(tpid, mpTopic, users);
}

function addSubject(mpTopic, title, multi = false) {
	let sub = Subject(multi, title);

	mpTopic.subjects.push(sub);

	return sub;
}

function addOption(subject, content) {
	let opt = MpOption(content);

	subject.options.push(opt);

	return opt;
}

const vote = {
	makeGwAction,
	makeGwBody,
	makeGwTopic: (mpTopic) => tp.makeGwTopic(mpTopic, makeGwBody),
	makeGwTopicx,

	makeMpSubjects,
	makeMpTopic: (type, gwTopic) => tp.makeMpTopic(type, gwTopic, makeMpSubjects),
	makeMpTopicx,

	newMpTopic: (param = { title, content, after: 3 }) => tp.newMpTopic(param, tp.type.vote.v),

	addSubject,
	delSubject: (mpTopic, idx) => tp.delElement(mpTopic, "subjects", idx),

	addOption,
	delOption: (subject, idx) => tp.delElement(subject, "options", idx),
};

module.exports = {
	vote: vote,
};
