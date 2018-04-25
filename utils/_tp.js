const $ = (name) => require(`${name}.js`)[name];
const helper = $("helper");
const res = $("res");

const app = getApp();

const $vote = {
	v: 0,
	name: res.Word("vote"),
};

const $notice = {
	v: 1,
	name: res.Word("notice"),
};

const $types = [$vote, $notice];

function getTypeByID(id) {
	return $types[id] || $vote;
}

const $open = {
	v: 0,
	name: res.Word("ing"),
};

const $closed = {
	v: 1,
	name: res.Word("closed"),
};

const $states = [$open, $closed];

function getStateByID(id) {
	return $states[id] || $closed;
}

function makeTid(type, tpid) {
	return ((type >>> 0) << 24) | (tpid >>> 0);
}

function tidTpid(tid) {
	return (tid >>> 0) & 0x00ffffff;
}

function tidType(tid) {
	return ((tid >>> 0) & 0xff000000) >> 24;
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

function GwTopic() {
	return {
		creater: 0,		// UID
		create: "",		// TimeString
		deadline: "",	// TimeString
		state: 0,		// state
		title: "",		// string
		content: "",	// string
	};
}

function MpTopic(body) {
	return {
		creater: 0,		// UID
		create: "",		// TimeString
		deadline: "",	// TimeString
		state: {
			v: 0,		// state value
			name: "",	// state show
		},
		title: "",		// string
		content: "",	// string
		subjects: [],	// Subject array
		body,
	};
}

function GwAction(action) {
	return {
		uid: app.user.uid,
		time: helper.simNowString(),
		action,
	};
}

function GwTopicx(tid, gwTopic) {
	return {
		tid, 			// TID
		topic: gwTopic,
		actions: [],	// Array GwAction
	};
}

function MpTopicx(mpTopic) {
	return {
		type: 0,		// topic type
		tpid: 0,		// topic id
		topic: mpTopic,	// topic
		// k: uid
		// v: UserTopic
		users: {},		// user's selection
	};
}

function UserTopic(mpTopic) {
	return {
		uid: 0,			// UID
		time: "",		// TimeString
		topic: mpTopic,
	};
}

function setTopic(dst, src) {
	dst.creater = src.creater;
	dst.create = src.create;
	dst.deadline = src.deadline;
	dst.title = src.title;
	dst.content = src.content;

	return dst;
}

function makeGwTopic(mpTopic, makeGwBody) {
	let gwTopic = {
		state: mpTopic.state.v,
		body: makeGwBody(mpTopic),
	};

	return setTopic(gwTopic, mpTopic);
}

function makeMpTopic(type, gwTopic, makeMpSubjects) {
	let state = gwTopic.state;
	let mpTopic = {
		type,
		state: {
			v: state,
			name: getStateByID(state).name,
		},
		subjects: makeMpSubjects(type, gwTopic),
	};

	return setTopic(mpTopic, gwTopic);
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
		subjects: [],
	};
}


function delSubject(topic, idx) {
	return delElement(topic, "subjects", idx);
}

const _tp = {
	type: {
		vote: $vote,
		notice: $notice,

		getbyid: getTypeByID,
	},
	state: {
		open: $open,
		closed: $closed,

		getbyid: getStateByID,
	},
	tid: {
		make: makeTid,
		tpid: tidTpid,
		type: tidType,
	},

	UserTopic,
	GwAction,

	GwTopic,
	GwTopicx,

	MpTopic,
	MpTopicx,

	setTopic,
	makeGwTopic,
	newMpTopic,

	delElement,
	delSubject,
};

module.exports = {
	_tp: _tp,
};
