// db.js

const api = require('api.js').api;

const keyprefix = "g-";

function groupkey (gid) {
	return keyprefix + gid;
}

function gidbykey(key) {
	return key.substr(keyprefix.length);
}

function newDeftUser() {
	return {
		nn: 4,
		uid: 0,
		dirty: false,
		session: "",
		gcount: 0,
		groups: {},
	};
}

const db = {
	user: {
		addGroup: (user, gid, opengid) => {
			let k = groupkey(gid);

			user.groups[k] = opengid;
			user.gcount++;
			user.dirty = true;

			return user;
		},
		AddGroup: (gid, opengid) => db.user.addGroup(app.user, gid, opengid),

		delGroup: (user, gid) => {
			let k = groupkey(gid);

			delete user.groups[k];
			user.gcount--;
			user.dirty = true;

			return user;
		},
		DelGroup: (gid) => db.user.delGroup(app.user, gid),

		getGroup: (user, gid) => {
			let k = groupkey(gid);

			return user.groups[k];
		},
		GetGroup: (gid) => db.user.getGroup(app.user, gid),

		getGroupEx: (user, opengid) => {
			let entrys = Object.entries(user.groups);

			for (let entry of entrys) {
				if (entry[1]==opengid) {
					return gidbykey(entry[0]);
				}
			}

			return undefined;
		},
		GetGroupEx: (opengid) => db.user.getGroupEx(app.user, opengid),

		isLocal: (user) => !!user.uid,

		vcopy: (dst, src) => {
			dst.nn = src.nn;
			dst.uid = src.uid;
			dst.session = src.session;

			dst.dirty = true;

			return dst;
		},

		copy: (dst, src) => {
			db.user.vcopy(dst, src);

			dst.gcount = src.gcount;
			dst.groups = {};

			Object.keys(src).map(k => dst.groups[k] = src.groups[k])

			return dst;
		},

		info: (user) => `nn=${user.nn} uid=${user.uid} session=${user.session} gcount=${user.gcount}`,

		load: (user) => {
			let v = api.getStorageSync('user');
			let mode = "local"

			if (!db.user.isLocal(v)) {
				v = newDeftUser();
				mode = "deft";
			}

			console.log(`load ${mode} user: ${db.user.info(v)}`);

			db.user.copy(user, v);

			user.dirty = false;

			return user;
		},
		Load: () => db.user.load(app.user),

		save: (user) => {
			if (user.dirty) {
				user.dirty = false;

				api.setStorageSync('user', user);

				console.log(`save user: ${db.user.info(user)}`);
			}

			return user;
		},
		Save: ()=>db.user.save(app.user),
	},

	group: {
		load: (groups, gid) => {
			let k = groupkey(gid);
			let v = api.getStorageSync(k);
			if (v) {
				groups[k] = v;
			} else {
				v = groups[k];
			}

			return v;
		},
		Load: (gid) => db.group.load(app.groups, gid),

		save: (groups, gid) => {
			let k = groupkey(gid);
			let v = groups[k];

			if (v) {
				api.setStorageSync(k, v);
			}

			return v;
		},
		Save: (gid) => db.group.Save(app.groups, gid),
	},

	page: {
		create: (pages, page) => {
			pages[page.route] = page;
			pages["current"] = page;
		},
		destroy: (pages, page) => {
			let current = getCurrentPages()[0].route;
			let path = page.route;

			delete pages[path];

			if (path == current) {
				// current have deleted
				pages["current"] = getCurrentPages()[0];
			}
		},
		destroyBy: (pages, path) => {
			let page = pages[path];

			if (page) {
				db.page.destroy(pages, page);
			}
		},
	},
};

module.exports = {
	db: db,
};
