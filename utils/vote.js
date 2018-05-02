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

function GwTopic() {
	return tp.GwTopic({ options: [] });
}

function MpTopic() {
	return tp.MpTopic(tp.type.vote.v, { options: [] });
}

/*
type GwTopicAction struct {
	Uid    uint32      `json:"uid"`
	Time   string      `json:"time"`
	Action interface{} `json:"action"`
}
*/
function MpUser(uid, selection, time = helper.simNowString()) {
	return {
		uid,			// UID
		time,			// TimeString
		selection,		// string
	};
}

function makeGwAction(mpTopic) {
	let selection = "";

	// 选项索引 0,1,2,3......
	// 将选择的选项索引作为字符串 push 到 selection 中，表明用户的选择
	mpTopic.body.options.map((opt, idx) => {
		if (opt.checked) {
			selection += idx + "";
		}
	});

	return selection;
}

function makeBody(topic, Option) {
	let options = [];

	topic.body.options.map(opt => options.push(Option(opt.content)));

	return { options };
}

function makeMpTopic(gwTopic) {
	return tp.makeMpTopic(tp.type.vote.v, gwTopic, gwTopic => makeBody(gwTopic, MpOption));
}

function makeMpTopicx(gwTopicx) {
	let tpid = tp.tid.tpid(gwTopicx.tid);
	let mpTopic = makeMpTopic(gwTopicx.topic);
	let users = {};

	// all user's action ==> users
	gwTopicx.actions.map(gwAction => {
		users[gwAction.uid + ""] = MpUser(gwAction.uid, gwAction.action, gwAction.time);
	});

	Object.keys(users).map(uid => {
		let selection = users[uid].action;
		let options = mpTopic.body.options;

		for (let idx of selection) {
			options[idx * 1].selected++;
		}
	});

	return tp.MpTopicx(tpid, mpTopic, users);
}

const vote = {
	makeGwAction,
	makeGwTopic: (mpTopic) => tp.makeGwTopic(mpTopic, topic => makeBody(topic, GwOption)),

	makeMpTopic,
	makeMpTopicx,

	newMpTopic: () => tp.newMpTopic(MpTopic),
	setMpTopicAfter: tp.setMpTopicAfter,

	addOption: (mpTopic, content) => mpTopic.body.options.push(MpOption(content)),
	delOption: (mpTopic, idx) => helper.delElement(mpTopic.body, "options", idx),
};

module.exports = { vote };
