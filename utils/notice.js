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

function newMpTopic(uid, param = { title, content, after: 3 }, type = $type.vote.v) {
	let now = new Date();
	let deadline = helper.addDay(now, param.after);

	return {
		type,
		creater: uid,
		create: helper.simTimeString(now),
		deadline: helper.simTimeString(deadline),
		title: param.title,
		content: param.content,
		options: [],
	};
}

function addOpt(topic, title, multi = false) {
	let opt = VoteOpt(title, multi);

	opt.title = title;
	opt.multi = multi;

	topic.options.push(opt);

	return opt;
}

function delOpt(topic, idx) {
	return delElement(topic, "options", idx);
}

function addOptItem(opt, content) {
	let item = MpVoteOptItem(content);

	item.content = content;

	opt.items.push(item);

	return item;
}

function delOptItem(opt, idx) {
	return delElement(opt, "items", idx);
}

const _tp = {
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
	addOpt,
	delOpt,
	addOptItem,
	delOptItem,
};

module.exports = {
	_tp: _tp,
};
