const $ = (name) => require(`${name}.js`)[name];
const helper = $("helper");
const res = $("res");
const tp = $("tp");

const app = getApp();

function Subject(title) {
	return { title };
}

function GwTopic() {
	return tp.GwTopic("");
}

function GwAction() {
	return tp.GwAction(false);
}

function body$subjects(objs) {
	let a = [];

	objs.map(obj => {
		a.push({
			title: obj.title,
			content: obj.content,
		});
	});

	return a;
}

function makeMpTopicx(gwTopicx) {
	let type = $tid.type(gwTopicx.tid);
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

function makeMpSubjects(gwTopic) {
	return body$subjects(gwTopic.body);
}

const notice = {
	makeGwTopic: (mpTopic) => tp.makeGwTopic(mpTopic, makeGwBody),
	makeGwTopicx,
	makeGwAction: (mpTopic) => true,
	makeGwBody: (mpTopic) => body$subjects(mpTopic.subjects),

	makeMpTopic: (type, gwTopic) => tp.makeMpTopic(type, gwTopic, makeMpSubjects),
	makeMpTopicx,

	newMpTopic: (uid, param = { title, content, after: 3 }) => tp.newMpTopic(uid, param, tp.type.notice.v),
	addSubject: (mpTopic, title) => mpTopic.subjects.push(Subject(title)),
	delSubject: (mpTopic, idx) => tp.delElement(mpTopic, "subjects", idx),
};

module.exports = {
	notice: notice,
};
