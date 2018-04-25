const $ = (name) => require(`${name}.js`)[name];
const helper = $("helper");
const res = $("res");
const _tp = $("_tp");

function Subject(title) {
	return {title};
}

function GwTopic() {
	return _tp.GwTopic("");
}

function GwAction() {
	return _tp.GwAction(false);
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

const $notice = {
	setMpTopicByAction: (mpTopic, gwAction) => {
		gwAction.action.map((selection, iOpt) => {
			mpTopic.options[iOpt].selection = selection;
		});
	},
};

function makeGwAction(mpTopic) {
	return true;
}

function makeGwBody(mpTopic) {
	return body$subjects(mpTopic.subjects);
}

function makeMpSubjects(gwTopic) {
	return body$subjects(gwTopic.body);
}

function makeGwTopic(mpTopic) {
	return _tp.makeGwTopic(mpTopic, makeGwBody);
}

function makeMpTopic(type, gwTopic) {
	return _tp.makeMpTopic(type, gwTopic, makeMpOptions);
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
		_tpid: $tid._tpid(gwTopicx.tid),
		topic: mpTopic,
		type,
		users,
	};
}

const notice = {
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
	addSubject: (mpTopic, title) => mpTopic.subjects.push(Subject(title)),
	delSubject: (mpTopic, idx) => _tp.delElement(mpTopic, "subjects", idx),
};

module.exports = {
	notice: notice,
};
