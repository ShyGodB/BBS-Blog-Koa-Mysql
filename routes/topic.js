const KoaRouter = require('koa-router');
const router = new KoaRouter();
const db = require('../lib/database');

//   根据子论坛展示帖子
router.get("/showTopics/:topicType", async (ctx) => {  //路由
	const boardName = ctx.params.topicType;
	const allTopicPromise = db.listAllTopicFromBBS();
	const allTopic = await allTopicPromise;
	const listBoardPromise = db.listChildBBSAll();
	const listBoard = await listBoardPromise;
	const listStarTopicPromise = db.listStarTopic();
	const listStarTopic = await listStarTopicPromise;
	const listTopicByTopicTypePromise = db.listTopicByTopicType(boardName);
	const listTopicByTopicType = await listTopicByTopicTypePromise;
	await ctx.render('/topics/showTopics', {
		allTopic: allTopic,
		listBoard: listBoard,
		user: ctx.session.user,
		boardName: boardName,
		listStarTopic: listStarTopic,
		listTopicByTopicType: listTopicByTopicType
	});
});

// 根据Id展示帖子
router.get('/showTopics/all/:id', async (ctx) => {
	const id = ctx.params.id;
	const topicPromise = db.getTopicFromBBSById(id);
	const topic = await topicPromise;
	const listMessageByTopicIdPromise = db.listMessageByTopicId(id);
	const listMessage = await listMessageByTopicIdPromise;
	await ctx.render('/topics/showTopic', {
		topic: topic,
		user: ctx.session.user,
		listMessage: listMessage,
	});
});


module.exports = router;

