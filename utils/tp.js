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

function GwTopic(body) {
	return {
		creater: 0,		// UID
		create: "",		// TimeString
		deadline: "",	// TimeString
		state: 0,		// state
		title: "",		// string
		content: "",	// string
		body,
	};
}

function MpTopic(type, body) {
	return {
		type,
		creater: 0,		// UID
		create: "",		// TimeString
		deadline: "",	// TimeString
		state: {
			v: 0,		// state value
			name: "",	// state show
		},
		title: "",		// string
		content: "",	// string
		body,
	};
}

function GwTopicx(tid, gwTopic, actions = []) {
	return {
		tid, 			// TID
		topic: gwTopic,
		actions,	// Array GwAction
	};
}

function MpTopicx(tpid, mpTopic, users = {}) {
	return {
		type: mpTopic.type,	// topic type
		tpid,				// topic id
		topic: mpTopic,		// topic
		// k: uid
		// v: MpUser
		users,				// user's selection
	};
}

function copyTopic(dst, src) {
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

	return copyTopic(gwTopic, mpTopic);
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

	return copyTopic(mpTopic, gwTopic);
}

function newMpTopic(MpTopic) {
	let mpTopic = MpTopic();

	mpTopic.creater = app.user.uid;
	mpTopic.create = helper.simNowString();

	return mpTopic;
}

function setMpTopicAfter(mpTopic, after) {
	let deadline = helper.addNowDay(after);

	mpTopic.deadline = helper.simTimeString(deadline);

	return mpTopic;
}

const tp = {
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

	GwTopic,
	GwTopicx,
	MpTopic,
	MpTopicx,

	copyTopic,
	makeGwTopic,

	newMpTopic,
	setMpTopicAfter,
};

module.exports = {
	tp: tp,
};
