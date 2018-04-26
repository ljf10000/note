const $ = (name) => require(`${name}.js`)[name];
const helper = $("helper");
const res = $("res");
const tp = $("tp");

const app = getApp();

function GwTopic() {
	return tp.GwTopic("");
}

function MpTopic() {
	return tp.MpTopic(tp.type.notice.v, "");
}

function GwAction() {
	return tp.GwAction(false);
}

function makeGwBody(mpTopic) {
	return "";
}

function makeMpBody(gwTopic) {
	return "";
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

const notice = {
	// one acknowlage per notice
	makeGwAction: (mpTopic) => true,
	makeGwTopic: (mpTopic) => tp.makeGwTopic(mpTopic, () => ""),

	makeMpTopic: (gwTopic) => tp.makeMpTopic(tp.type.notice.v, gwTopic, () => ""),
	makeMpTopicx,

	newMpTopic: (title, content, after = 3) => {
		let mpTopic = tp.newMpTopic(tp.type.notice.v, title, content, after);

		mpTopic.body = "";

		return mpTopic;
	},
};

module.exports = {
	notice: notice,
};
