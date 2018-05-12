// pg.js
const $ = (name) => require(`${name}.js`)[name];
const res = $("res");
const api = $("api");
const mp = $("mp");

const app = getApp();

const pg = {
	share: (page, options) => {
		console.log(`share from ${options.from} to ${options.target}`);

		return {
			title: res.APP,
			path: `/${page.route}?shared=1`,
			success: v => {
				let shareTicket = v.shareTickets[0];

				console.info(`${page.name} share success v=${JSON.stringify(v)}`);

				mp.start(app, page, shareTicket);
			},
			fail: e => {
				console.error(`${page.name} share failed e=${e}`);

				let msg = res.Transfer("invite fail");

				api.showModal(res.APP, msg);
			},
		};
	},
};

module.exports = { pg };
