const KoaRouter = require('koa-router');
const router = new KoaRouter();
const editBoard = require('../lib/boards');
const editTopic = require('../lib/topics');


//帖子管理--管理员
router.get("/admin/manageTopics/:topicType", async (ctx) => {  //路由
	const listBoardPromise = editBoard.listChildBBS();
	const listBoard = await listBoardPromise;
	const allTopicPromise = editTopic.listAllTopicFromBBS();
	const allTopic = await allTopicPromise;
	const listStarTopicPromise = editTopic.listStarTopic();
	const listStarTopic = await listStarTopicPromise;
	const listTopTopicPromise = editTopic.listTopTopic();
	const listTopTopic = await listTopTopicPromise;
	const topicType = ctx.params.topicType;
	const listTopicByTopicTypePromise = editTopic.listTopicByTopicType(topicType);
	const listTopicByTopicType = await listTopicByTopicTypePromise;
	await ctx.render("/admin/manageTopics", {
		layout: 'layouts/layout_admin',
		topicType: topicType,
		listBoard: listBoard,
		allTopic: allTopic,
		listTopTopic: listTopTopic,
		listStarTopic: listStarTopic,
		listTopicByTopicType: listTopicByTopicType,
	});
});

//  删除帖子
router.get("/admin/manageTopics/all/delete/:id", async (ctx) => {
	const id = ctx.params.id;
	const deleteTopicPromise = editTopic.deleteTopicById(id);
	await deleteTopicPromise;
	ctx.redirect("/admin/manageTopics/all");
});

//  设置精华帖子
router.get("/admin/manageTopics/all/setStar/:id", async (ctx) => {
	const id = ctx.params.id;
	const setStarPromise = editTopic.setStarTopic(id);
	await setStarPromise;
	ctx.redirect("/admin/manageTopics/star");
});

//  取消精华帖子
router.get("/admin/manageTopics/all/cancelStar/:id", async (ctx) => {
	const id = ctx.params.id;
	const reduceStarPromise = editTopic.reduceStarTopic(id);
	await reduceStarPromise;
	ctx.redirect("/admin/manageTopics/star");
});



//  设置置顶帖子
router.get("/admin/manageTopics/all/setTop/:id", async (ctx) => {
	const id = ctx.params.id;
	const setTopTopicPromise = editTopic.setTopTopic(id);
	await setTopTopicPromise;
	ctx.redirect("/admin/manageTopics/top");
});

//  取消置顶帖子
router.get("/admin/manageTopics/all/cancelTop/:id", async (ctx) => {
	const id = ctx.params.id;
	const reduceTopTopicPromise = editTopic.reduceTopTopic(id);
	await reduceTopTopicPromise;
	ctx.redirect("/admin/manageTopics/top");
});



module.exports = router;

