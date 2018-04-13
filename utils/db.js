// db.js

const m_api = require('api.js');
const api = m_api.api;

const $db = {
	gkey: gid => 'g-' + gid,
	user: {
		deft: () => ({
			nn: 4,
			uid: 0,
			dirty: false,
			session: "",
			gcount: 0,
			groups: {},
		}),
	},
};

const db = {
	user: {
		addGroup: (user, gid, opengid) => {
			let k = $db.gkey(gid);

			user.groups[k] = opengid;
			user.gcount++;
			user.dirty = true;

			return user;
		},

		delGroup: (user, gid) => {
			let k = $db.gkey(gid);

			delete user.groups[k];
			user.gcount--;
			user.dirty = true;

			return user;
		},

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

			let keys = Object.keys(src);
			for (let key of keys) {
				dst.groups[key] = src.groups[key];
			}

			return dst;
		},

		info: (user) => `nn=${user.nn} uid=${user.uid} session=${user.session} gcount=${user.gcount}`,

		load: (user) => {
			let v = api.getStorageSync('user');
			let mode = "local"

			if (!db.user.isLocal(v)) {
				v = $db.user.deft();
				mode = "deft";
			}

			console.log(`load ${mode} user: ${db.user.info(v)}`);

			db.user.copy(user, v);

			user.dirty = false;

			return user;
		},

		save: (user) => {
			if (user.dirty) {
				user.dirty = false;

				api.setStorageSync('user', user);

				console.log(`save user: ${db.user.info(user)}`);
			}

			return user;
		},
	},

	group: {
		load: (groups, gid) => {
			let k = $db.gkey(gid);
			let v = api.getStorageSync(k);
			if (v) {
				groups[k] = v;
			} else {
				v = groups[k];
			}

			return v;
		},

		save: (groups, gid) => {
			let k = $db.gkey(gid);
			let v = groups[k];

			if (v) {
				api.setStorageSync(k, v);
			}

			return v;
		},
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
