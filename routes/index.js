const KoaRouter = require('koa-router');
const router = new KoaRouter();
const db = require('../lib/database');

//  请求主页
router.get("/", async (ctx) => { //路由
	const allTopicPromise = db.listAllTopicFromBBS();
	const allTopic = await allTopicPromise;
	const child_BBSPromise = db.listChildBBSAll();
	const child_BBS = await child_BBSPromise;
	await ctx.render('index', {
		user: ctx.session.user,
		child_BBS: child_BBS,
		allTopic: allTopic
	});
});

router.post("/", async (ctx) => {
	// 拿到用户在搜索框中输入的字符串
	const userInputString = ctx.request.body.user_input_string;
	const userInputArray = userInputString.split(' ');
	console.log(userInputArray)


});

module.exports = router;

