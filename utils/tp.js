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

const $state= {
	open: {
		v: 0,
	},
	closed: {
		v: 1,
	},
};

function getVoteAction(topic) {
	let action = [];

	topic.options.map(opt => {
		let select = "";

		opt.items.map((v, i) => {
			if (v.checked) {
				select += i + "";
			}
		})

		action.push(select);
	})

	return action;
}

function getVoteBody(topic) {
	let body = [];

	topic.options.map(opt => {
		let items = [];

		opt.items.map((v, i) => {
			items.push(v.content);
		})

		body.push(items);
	})

	return body;
}

function getGwAction(topic) {
	switch (topic.type) {
		case $type.vote.v:
			return getVoteAction(topic);
		case $type.notice.v:
			return "";
		default:
			return "";
	}
}

function getGwTopic(topic) {
	let obj = {
		creater: topic.creater,
		create: topic.create,
		deadline: topic.deadline,
		title: topic.title,
		content: topic.content,
		body: "",
	};

	if (topic.type == $type.vote.v) {
		obj.body = getVoteBody(topic);
	}

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

	getGwTopic,

	newTopic,
	addOption,
	delOption,
	addOptItem,
	delOptItem,
};

module.exports = {
	tp: tp,
};
