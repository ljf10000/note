// util.js

function getRes(app, id) {
	let obj = $res[id];

	return obj ? obj[app.lang] : "";
}

const $res = {
	wxLogin: ["微信登陆", "webcat login"],
	mpLogin: ["小程序登陆", "mini program login"],
};

const res = {
	wxLogin: (app) => getRes(app, "wxLogin"),
	mpLogin: (app) => getRes(app, "mpLogin"),
};

module.exports = {
	res: res,
};
