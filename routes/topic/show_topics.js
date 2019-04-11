const KoaRouter = require('koa-router');
const router = new KoaRouter();
const editBoard = require('../../lib/boards');
const editTopic = require('../../lib/topics');
const editMessage = require('../../lib/message');
// const fetch = require('node-fetch');


//   根据子论坛展示帖子
router.get("/showTopics/:topicType", async (ctx) => {  //路由
	const boardName = ctx.params.topicType;
	const allTopicPromise = editTopic.listAllTopic();
	const allTopic = await allTopicPromise;
	const listBoardPromise = editBoard.listBoardAll();
	const listBoard = await listBoardPromise;
	const listStarTopicPromise = editTopic.listStarTopic();
	const listStarTopic = await listStarTopicPromise;
	const listTopicByTopicTypePromise = editTopic.listTopic(boardName);
	const listTopicByTopicType = await listTopicByTopicTypePromise;
	await ctx.render('/topics/show_topics', {
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
	const topicPromise = editTopic.getTopicById(id);
	const topic = await topicPromise;
	const listMessageByTopicIdPromise = editMessage.listMessage(id);
	const listMessage = await listMessageByTopicIdPromise;
	await ctx.render('/topics/show_topic', {
		id: id,
		topic: topic,
		layout: false,
		user: ctx.session.user,
		listMessage: listMessage,

	});
});



module.exports = router;

