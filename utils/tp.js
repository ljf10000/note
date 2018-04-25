const $ = (name) => require(`../${name}.js`)[name];
const helper = $("helper");
const res = $("res");

const $type = {
	vote: {
		v: 0,
		name: res.Word("vote"),
	},
	notice: {
		v: 1,
		name: res.Word("notice"),
	},

	byid: [$type.vote, $type.notice],
	getbyid: (id) => $type.byid(id) || $type.vote,
};

const $state = {
	open: {
		v: 0,
		name: res.Word("ing"),
	},
	closed: {
		v: 1,
		name: res.Word("closed"),
	},

	byid: [$state.open, $state.closed],
	getbyid: (id) => $state.byid(id) || $state.closed,
};

const $tid = {
	make: (type, tpid) => ((type >>> 0) << 24) | (tpid >>> 0),
	tpid: (tid) => (tid >>> 0) & 0x00ffffff,
	type: (tid) => ((tid >>> 0) & 0xff000000) >> 24,
};

const VoteOpt = {
	multi: false,	// bool
	title: "",		// string
	// gw: GwVoteOptItem array
	// mp: MpVoteOptItem array
	items: [],		// array
};

const MpVoteOptItem = {
	content: "",	// string
	checked: false,	// bool, just for checkin
	selected: 0,	// int, just for show
	precent: 0,		// double, just for show
};
const GwVoteOptItem = MpVoteOptItem.content; // string

const GwTopic = {
	creater: 0,		// UID
	create: "",		// TimeString
	deadline: "",	// TimeString
	state: 0,		// state
	title: "",		// string
	content: "",	// string

	// vote: VoteOpt array, length==MpTopic.options.length
	// notice: ""
	body: [],
};

const MpTopic = {
	creater: 0,		// UID
	create: "",		// TimeString
	deadline: "",	// TimeString
	state: {
		v: 0,		// state value
		name: "",	// state show
	},
	title: "",		// string
	content: "",	// string

	// vote: VoteOpt array, length==MpTopic.options.length
	// notice: []
	options: [],
};

const GwTopicx = {
	tid: 0, 		// TID
	topic: GwTopic,
	actions: [],	// Array GwAction
};

const MpTopicx = {
	type: 0,		// topic type
	tpid: 0,		// topic id
	topic: MpTopic,	// topic
	// k: uid
	// v: ???
	users: {},		// user's selection
};

const GwAction = {
	uid: 0,		// UID
	time: "",	// TimeString

	// vote: GwVoteAction array, length==MpTopic.options.length
	// notice: bool
	action: [],
};
const GwVoteAction = ""; // string, option item index selected

const $vote = {
	getGwSelection: (opt) => {
		let selection = "";

		// 选项索引 0,1,2,3......
		// 将选择的选项索引作为字符串 push 到 selection 中，表明用户的选择
		opt.items.map((item, idx) => {
			if (item.checked) {
				selection += idx + "";
			}
		});

		return selection;
	},

	// mp topic ==> gw topic action
	makeGwAction: (mpTopic) => {
		let a = [];

		mpTopic.options.map(opt => a.push($vote.getGwSelection(opt)));

		return a;
	},

	// mp topic ==> gw topic body
	makeGwBody: (mpTopic) => {
		let a = [];

		mpTopic.options.map(opt => {
			let items = [];

			opt.items.map(item => items.push(item.content));

			a.push({
				multi: opt.multi,
				title: opt.title,
				items,
			});
		});

		return a;
	},

	// gw topic ==> mp topic options
	makeMpOptions: (gwTopic) => {
		let a = [];

		gwTopic.body.map(opt => {
			let items = [];

			opt.items.map(content => items.push({
				content,
				checked: false,
				selected: 0,
			}));

			a.push({
				multi: opt.multi,
				title: opt.title,
				items,
			});
		});

		return a;
	},
};

const $notice = {
	makeGwAction: (topic) => (true),
	makeGwBody: (topic) => (""),
	makeMpOptions: (gwTopic) => ([]),
};

function $vt(type) {
	switch (type) {
		case $type.vote.v:
			return $vote;
		default:
			return $notice;
	}
}

function makeGwAction(mpTopic) {
	return $vt(mpTopic.type).makeGwAction(mpTopic);
}

function makeGwBody(mpTopic) {
	return $vt(mpTopic.type).makeGwBody(mpTopic);
}

function makeMpOptions(type, gwTopic) {
	return $vt(type).makeMpOptions(gwTopic);
}

function setTopic(dst, src) {
	dst.creater = src.creater;
	dst.create = src.create;
	dst.deadline = src.deadline;
	dst.title = src.title;
	dst.content = src.content;

	return dst;
}

function makeGwTopic(mpTopic) {
	let gwTopic = {
		state: mpTopic.state.v,
		body: makeGwBody(mpTopic),
	};

	return setTopic(gwTopic, mpTopic);
}

function makeMpTopic(type, gwTopic) {
	let state = gwTopic.state;
	let mpTopic = {
		type,
		state: {
			v: state,
			name: $state.getbyid(state).name,
		},
		options: makeMpOptions(type, gwTopic),
	};

	return setTopic(mpTopic, gwTopic);
}

function makeMpTopicx(gwTopicx) {
	let type = $tid.type(gwTopicx.tid);
	let topic = makeMpTopic(type, gwTopicx);

	topic.tpid = $tid.tpid(gwTopicx.tid);
	topic.users = {};

	gwTopicx.actions.map(gwAction => {
		// gwAction = {uid, time, action}
		let ukey = gwAction.uid + "";
		let users = topic.users[ukey] || {};
		let uoptions = users.options || new Array(topic.options.length).fill({});

		users.uid = gwAction.uid;
		users.time = gwAction.time;

		gwAction.action.map((uselection, i) => {
			let selection = uoptions[i].selection || new Array(topic.options.items.length).fill(false);

			for (let idx of uselection) {
				selection[idx * 1] = true;
			}

			uoptions[i].selection = selection;
		});

		users.options = uoptions;
		topic.users[ukey] = users;
	});

	Object.keys(topic.users).map(uid => {
		let user = topic.users[uid];

		user.options.map((option, i) => {
			option.selection.map((selected, j) => {
				topic.options[i].items[j].checked++;
			});
		})
	})

	return topic;
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

function delElement(obj, key, idx) {
	let old = obj[key];
	if (idx < 0 | idx >= old.length) {
		throw `delete element with count ${old.length} by index[${idx}]`;
	}

	let a = [];

	old.map((v, i) => i == idx || a.push(v))

	obj[key] = a;

	return a;
}

function addOpt(topic, title, multi = false) {
	let opt = {
		multi,
		title,
		items: [],
	};

	topic.options.push(opt);

	return opt;
}

function delOpt(topic, idx) {
	return delElement(topic, "options", idx);
}

function addOptItem(opt, content) {
	let item = {
		content,
		checked: false,
	};

	opt.items.push(item);

	return item;
}

function delOptItem(opt, idx) {
	return delElement(opt, "items", idx);
}

const tp = {
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
	tp: tp,
};
