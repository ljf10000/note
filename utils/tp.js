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
};

const $state = {
	open: {
		v: 0,
	},
	closed: {
		v: 1,
	},
};

const makeTid = (type, tpid) => ((type >>> 0) << 24) | (tpid >>> 0);
const getTpid = tid => (tid >>> 0) & 0x00ffffff;
const getType = tid => ((tid >>> 0) & 0xff000000) >> 24;

const $vote = {
	// get action from topic
	getAction: (options) => {
		let action = [];

		options.map(opt => {
			let selection = "";

			// 选项索引 0,1,2,3......
			// 将选择的选项索引作为字符串 push 到 selection 中
			opt.items.map((v, i) => {
				if (v.checked) {
					selection += i + "";
				}
			})

			action.push(selection);
		});

		return action;
	},
	getBody: (options) => {
		let body = [];

		options.map(opt => {
			let items = [];

			opt.items.map(v => {
				items.push(v.content);
			})

			body.push(items);
		})

		return body;
	},
	getOptions: (body) => {
		let options = [];

		body.map(items => {
			let opt = {
				items: [],
			};

			items.map(v => {
				opt.items.push({
					content: v,
					checked: 0,
				});
			});

			options.push(opt);
		})

		return options;
	},
};

function topicHeader(topic) {
	return {
		creater: topic.creater,
		create: topic.create,
		deadline: topic.deadline,
		title: topic.title,
		content: topic.content,
	};
}

function getGwAction(topic) {
	switch (topic.type) {
		case $type.vote.v:
			return $vote.getAction(topic.options);
		default:
			return "";
	}
}

function getGwTopic(topic) {
	let obj = topicHeader(topic);

	switch (topic.type) {
		case $type.vote.v:
			obj.body = $vote.getBody(topic.options);
		default:
			obj.body = "";
	}

	return obj;
}

function getTopic(type, gwTopic) {
	let obj = topicHeader(gwTopic);

	obj.type = type;

	switch (type) {
		case $type.vote.v:
			obj.options = $vote.getOptions(gwTopic.body);
		default:
			obj.options = [];
	}

	return obj;
}

function getTopicx(gwTopicx) {
	let type = getType(gwTopicx.tid);
	let obj = getTopic(type, gwTopicx);
	let count = obj.options.length;

	obj.tpid = getTpid(gwTopicx.tid);
	obj.users = {};

	gwTopicx.actions.map(uaction => {
		// userAction = {uid, time, action}
		let ukey = uaction.uid + "";
		let users = obj.users[ukey] || {};
		let uoptions = users.options || new Array(count).fill({});

		users.uid = uaction.uid;
		users.time = uaction.time;

		uaction.action.map((uselection, i) => {
			let selection = uoptions[i].selection || new Array(obj.options.items.length).fill(false);

			for (let idx of uselection) {
				selection[idx * 1] = true;
			}

			uoptions[i].selection = selection;
		});

		users.options = uoptions;
		obj.users[ukey] = users;
	});

	Object.keys(obj.users).map(uid => {
		let user = obj.users[uid];

		user.options.map((option, i) => {
			option.selection.map((selected, j) => {
				obj.options[i].items[j].checked++;
			});
		})
	})

	return obj;
}

function newTopic(uid, param = { title, content, after: 3 }, type = $type.vote) {
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
	let array = obj[key];
	if (idx < 0 | idx >= array.length) {
		throw `delete element with count ${array.length} by index[${idx}]`;
	}

	let newArray = [];

	array.map((v, i) => {
		if (i != idx) {
			newArray.push(v);
		}
	})

	obj[key] = newArray;
}

function addOption(topic, title, multi = false) {
	let obj = {
		multi,
		title,
		items: [],
	};

	topic.body.push(obj);

	return obj;
}

function delOption(topic, idx) {
	delElement(topic, "options", idx);
}

function addOptItem(opt, content) {
	let obj = {
		content,
		checked: false,
	};

	opt.items.push(obj);

	return obj;
}

function delOptItem(opt, idx) {
	delElement(opt, "items", idx);
}

function updateOptItem(opt, idx, checked = true) {
	opt.items[idx].checked = checked;
}

const tp = {
	type: $type,
	state: $state,

	makeTid: makeTid,
	getTpid: getTpid,
	getType: getType,

	getGwTopic,
	getGwTopicx,
	getGwAction,

	newTopic,
	addOption,
	delOption,
	addOptItem,
	delOptItem,
};

module.exports = {
	tp: tp,
};
