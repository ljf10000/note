const $ = (name) => require(`${name}.js`)[name];
const helper = $("helper");
const res = $("res");
const tp = $("tp");

const app = getApp();

function GwTopic() {
	return tp.GwTopic({ ack: 0 });
}

function MpTopic() {
	return tp.MpTopic(tp.type.notice.v, { ack: 0 });
}

/*
type GwTopicAction struct {
	Uid    uint32      `json:"uid"`
	Time   string      `json:"time"`
	Action interface{} `json:"action"`
}
*/
function MpUser(uid, time = helper.simNowString()) {
	return {
		uid,			// UID
		time,			// TimeString
		ack: true,		// bool
	};
}

function makeBody(topic) {
	return { ack: 0 };
}

function makeMpTopic(gwTopic) {
	return tp.makeMpTopic(tp.type.notice.v, gwTopic, makeBody);
}

function makeMpTopicx(gwTopicx) {
	let tpid = tp.tid.tpid(gwTopicx.tid);
	let mpTopic = makeMpTopic(gwTopicx.topic);
	let users = {};

	// all user's action ==> users
	gwTopicx.actions.map(gwAction => {
		users[gwAction.uid + ""] = MpUser(gwAction.uid, gwAction.action, gwAction.time);
	});

	Object.keys(users).map(uid => mpTopic.body.ack++);

	return tp.MpTopicx(tpid, mpTopic, users);
}

const notice = {
	// one acknowlage per notice
	makeGwAction: (mpTopic) => true,
	makeGwTopic: (mpTopic) => tp.makeGwTopic(mpTopic, makeBody),

	makeMpTopic,
	makeMpTopicx,

	newMpTopic: () => tp.newMpTopic(MpTopic),
	setMpTopicAfter: tp.setMpTopicAfter,
};

module.exports = {
	notice: notice,
};
