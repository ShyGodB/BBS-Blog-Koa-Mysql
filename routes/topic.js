const KoaRouter = require('koa-router');
const router = new KoaRouter();
const db = require('../lib/database');

//   根据子论坛展示帖子
router.get("/showTopics/:topicType", async (ctx) => {  //路由
	const topicType = ctx.params.topicType;
	const allTopicPromise = db.listAllTopicFromBBS();
	const allTopic = await allTopicPromise;
	const childBBSPromise = db.listChildBBSAll();
	const childBBS = await childBBSPromise;
	const listStarTopicPromise = db.listStarTopic();
	const listStarTopic = await listStarTopicPromise;
	const listTopicByTopicTypePromise = db.listTopicByTopicType(topicType);
	const listTopicByTopicType = await listTopicByTopicTypePromise;
	await ctx.render('/topics/showTopics', {
		allTopic: allTopic,
		childBBS: childBBS,
		user: ctx.session.user,
		topicType: topicType,
		listStarTopic: listStarTopic,
		listTopicByTopicType: listTopicByTopicType
	});
});

// 根据Id展示帖子
router.get('/showTopics/all/:id', async (ctx) => {
	const id = ctx.params.id;
	const topicPromise = db.getTopicFromBBSById(id);
	const topic = await topicPromise;
	await ctx.render('/topics/showTopic', {
		user: ctx.session.user,
		topic: topic
	});
});


module.exports = router;

