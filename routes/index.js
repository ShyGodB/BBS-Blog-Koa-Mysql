const KoaRouter = require('koa-router');
const router = new KoaRouter();
const db = require('../database');

//  请求主页
router.get("/", async (ctx) => { //路由
	const personPromise = db.getUserById(1);
	const person = await personPromise;
	const allTopicPromise = db.listAllTopicFromBBS();
	const allTopic = await allTopicPromise;
	const child_BBSPromise = db.listChildBBS();
	const child_BBS = await child_BBSPromise;
	await ctx.render('index', {
		user: ctx.session.user,
		child_BBS: child_BBS,
		allTopic: allTopic,
		person: person
	});
});

module.exports = router;

