const $ = (name) => require(`${name}.js`)[name];
const helper = $("helper");
const res = $("res");
const _tp = $("_tp");

function GwOption(content = "") {
	return { content };
}

function MpOption(content = "") {
	return {
		content,		// string
		selected: 0,	// int, just for show
	};
}

function Subject(title, multi = false) {
	return {
		multi,			// bool
		title,			// string
		options: [],	// GwOption or MpOption array
	};
}

function GwTopic() {
	return _tp.GwTopic([]);
}

function GwAction() {
	return _tp.GwAction([]);
}

const $vote = {
	setMpTopicByAction: (mpTopic, gwAction) => {
		gwAction.action.map((selection, iOpt) => {
			let opt = mpTopic.options[iOpt];
			let items = opt.items;

			for (let idx of selection) {
				items[idx].selected++;
			}
			opt.selection = selection;
		});
	},
};

function $makeSelection(subject) {
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

	mpTopic.subjects.map(sub => a.push($makeSelection(sub)));

	return a;
}

function makeGwBody(mpTopic) {
	let a = [];

	mpTopic.subjects.map(sub => {
		let options = [];

		sub.options.map(opt => options.push(GwOption(opt.content)));

		a.push({
			multi: sub.multi,
			title: sub.title,
			options,
		});
	});

	return a;
}

function makeMpSubjects(gwTopic) {
	let a = [];

	gwTopic.body.map(sub => {
		let options = [];

		sub.options.map(opt => options.push(MpOption(opt.content)));

		a.push({
			multi: sub.multi,
			title: sub.title,
			options,
		});
	});

	return a;
}

function makeGwTopic(mpTopic) {
	return _tp.makeGwTopic(mpTopic, makeGwBody);
}

function makeMpTopic(type, gwTopic) {
	return _tp.makeMpTopic(type, gwTopic, makeMpOptions);
}

function makeMpTopicx(gwTopicx) {
	let type = _tp.tid.type(gwTopicx.tid);
	let mpTopic = makeMpTopic(type, gwTopicx.topic);
	let users = {};

	gwTopicx.actions.map(gwAction => {
		let topic = makeMpTopic(type, gwTopicx.topic);
		let user = {
			uid: gwAction.uid,
			time: gwAction.time,
			topic,
		};

		gwAction.action.map((selection, iOpt) => {
			let opt = topic.options[iOpt];
			let items = opt.items;

			for (let idx of selection) {
				items[idx].selected++;
			}
			opt.selection = selection;
		});

		users[gwAction.uid + ""] = user;
	});

	Object.keys(users).map(ukey => {
		users[ukey].topic.options.map((opt, i) => {
			opt.items.map((item, j) => {
				mpTopic.options[i].items[j].selected++;
			});
		});
	});

	return {
		tpid: $tid.tpid(gwTopicx.tid),
		topic: mpTopic,
		type,
		users,
	};
}

const vote = {
	type: $type,
	state: $state,
	tid: $tid,

	makeGwTopic,
	makeGwTopicx,
	makeGwAction,
	makeGwBody,

	makeMpTopic,
	makeMpTopicx,

	newMpTopic,
	addSubject: (mpTopic, title, multi = false) => mpTopic.subjects.push(Subject(title, multi)),
	delSubject: (mpTopic, idx) => _tp.delElement(mpTopic, "subjects", idx),
	
	addOption: (subject, content) => subject.options.push(MpOption(content)),
	delOption: (subject, idx) => _tp.delElement(subject, "options", idx),
};

module.exports = {
	vote: vote,
};
