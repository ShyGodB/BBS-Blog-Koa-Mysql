const KoaRouter = require('koa-router');
const editBoard = require('../../lib/boards');
const editTopic = require('../../lib/topics');
const editMessage = require('../../lib/message');

const router = new KoaRouter();


//   根据子论坛展示帖子
router.get("/showTopics/:id", async (ctx) => {  //路由
	const boardId = ctx.params.id;

	const allTopicPromise = editTopic.listAllTopic();
	const allTopic = await allTopicPromise;

	const listBoardPromise = editBoard.listBoardAll();
	const listBoard = await listBoardPromise;

	const listStarTopicPromise = editTopic.listStarTopic();
	const listStarTopic = await listStarTopicPromise;

	const listStarNotTopTopicPromise = editTopic.listStarNotTopTopic();
	const listStarNotTopTopic = await listStarNotTopTopicPromise;

	const listStarTopTopicPromise = editTopic.listStarTopTopic();
	const listStarTopTopic = await listStarTopTopicPromise;

	const listTopTopicPromise = editTopic.listTopTopic();
	const listTopTopic = await listTopTopicPromise;

	const listSimpleTopicPromise = editTopic.listSimpleTopic();
	const listSimpleTopic = await listSimpleTopicPromise;

	const listTopicPromise = editTopic.listTopic(boardId);
	const listTopic = await listTopicPromise;

	const listSimpleTopTopicPromise = editTopic.listSimpleTopTopic(boardId);
	const listSimpleTopTopic = await listSimpleTopTopicPromise;

	const listSimpleNotTopTopicPromise = editTopic.listSimpleNotTopTopic(boardId);
	const listSimpleNotTopTopic = await listSimpleNotTopTopicPromise;

	await ctx.render('/topics/show_topics', {
		boardId: boardId,
		allTopic: allTopic,
		listBoard: listBoard,
		listTopic: listTopic,
		user: ctx.session.user,
		listTopTopic: listTopTopic,
		listStarTopic: listStarTopic,
		listSimpleTopic, listSimpleTopic,
		listStarTopTopic, listStarTopTopic,
		listSimpleTopTopic: listSimpleTopTopic,
		listStarNotTopTopic: listStarNotTopTopic,
		listSimpleNotTopTopic: listSimpleNotTopTopic
	});
});

// 根据Id展示帖子
router.get('/showTopics/all/:id', async (ctx) => {
	const id = ctx.params.id;
	const topicPromise = editTopic.getTopicById(id);
	const topic = await topicPromise;
	const user = ctx.session.user;
	const listMessageByTopicIdPromise = editMessage.listMessage(id);
	const listMessage = await listMessageByTopicIdPromise;
	await ctx.render('/topics/show_topic', {
		id: id,
		user: user,
		topic: topic,
		layout: false,
		listMessage: listMessage,
	});
});


module.exports = router;

