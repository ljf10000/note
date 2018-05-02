// db.js
const $ = (name) => require(`${name}.js`)[name];
const api = $("api");

const gidPrefix = "gid-";

function gidkey(gid) {
	return gidPrefix + gid;
}

function gidbykey(key) {
	return key.substr(gidPrefix.length);
}

function newDeftUser() {
	return {
		nn: 4,
		uid: 0,
		session: "",
		byid: {},
		byname: {},
	};
}

const db = {
	user: {
		addGroup: (user, gid, opengid) => {
			let tmpgid = user.byname[opengid];
			if (tmpgid) {
				delete user.byid[tmpgid + ""];
			}

			user.byid[gid + ""] = opengid;
			user.byname[opengid] = gid;

			return user;
		},

		delGroup: (user, gid, opengid) => {
			let k = gid + "";
			let name = opengid ? opengid : user.byid[k];

			delete user.byid[k];
			if (name) {
				delete user.byname[name];
			}

			return user;
		},

		getOpenGid: (user, gid) => user.byid[gid + ""],

		getGid: (user, opengid) => user.byname[opengid],
		getFirstGid: (user) => {
			let gids = Object.keys(user.byid);

			return gids ? gids[0]: 0;
		},
		getGroupCount: (user) => Object.keys(user.byid).length,
		getGroups: (user) => {
			Object.keys(user.byid).reduce((pre, cur) => {
				pre.push({
					gid: cur,
					opengid: user.byid[cur],
				});

				return pre;
			}, []);
		},

		vcopy: (dst, src) => {
			dst.nn = src.nn;
			dst.uid = src.uid;
			dst.session = src.session;

			return dst;
		},

		copy: (dst, src) => {
			db.user.vcopy(dst, src);

			dst.byid = {};
			dst.byname = {},

				Object.keys(src.byid).map(k => dst.byid[k] = src.byid[k]);
			Object.keys(src.byname).map(k => dst.byname[k] = src.byname[k]);

			return dst;
		},

		load: (user) => {
			if (user && user.uid) {
				return user;
			}

			let v = api.getStorageSync("user");
			let mode = "local"

			if (!v) {
				v = newDeftUser();
				mode = "deft";
			}

			console.log(`load ${mode} user: ${JSON.stringify(v)}`);

			db.user.copy(user, v);

			return user;
		},

		save: (user) => {
			api.setStorageSync("user", user);

			console.log(`save user: ${JSON.stringify(user)}`);

			return user;
		},

		clear: () => api.removeStorageSync("user"),
	},

	group: {
		load: (groups, gid) => {
			let k = gidkey(gid);
			if (groups && groups[k]) {
				return groups[k];
			}

			let v = api.getStorageSync(k);
			if (v) {
				groups[k] = v;
			} else {
				v = groups[k];
			}

			return v;
		},

		save: (groups, gid, v) => {
			let k = gidkey(gid);

			if (v) {
				groups[k] = v;

				api.setStorageSync(k, v);
			}

			return v;
		},
	},
};

module.exports = { db };
