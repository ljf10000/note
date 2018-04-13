// mq.js

function tp_init(obj) {
	obj.seq = 0;
	obj.head = undefined;
	obj.tail = undefined;
}

class topic {
	static init(obj) {
		obj.seq = 0;
		obj.head = undefined;
		obj.tail = undefined;
	}

	constructor(tpid) {
		this.tpid = tpid;
		this.q = new Map();

		tp_init(this);
	}

	clear() {
		this.q.clear();

		tp_init(this);
	}

	sendmsg(sender, msg) {
		let seq = this.seq++;

		this.q.set(seq, { sender, msg });
		this.head = seq;
		if (1 == this.q.size) {
			this.tail = seq;
		}
	}

	recvmsg() {
		if (0 == this.q.size) {
			return undefined;
		}

		let head = this.head;
		let data = this.q.get(head);

		this.q.delete(head);

		return data;
	}

	size() {
		return this.q.size;
	}

	seq() {
		return this.seq;
	}
};

class mq {
	constructor() {
		this.box = {};
	}

	clear() {
		this.box = {};
	}

	clearTopic(tpid) {
		let tp = this.box[tpid];

		if (tp) {
			tp.clear();
		}
	}

	addTopic(tpid) {
		if (!this.box[tpid]) {
			this.box[tpid] = new topic(tpid);
		}
	}

	delTopic(tpid) {
		if (this.box[tpid]) {
			delete this.box[tpid];
		}
	}

	sendmsg(sender, recver, msg) {
		let tp = this.box[recver];
		
		if (tp) {
			tp.sendmsg(sender, msg);
		}
	}

	recvmsg(tpid) {
		let tp = this.box[tpid];

		return tp ? tp.recvmsg() : {};
	}
}

module.exports = {
	mq: mq,
};
