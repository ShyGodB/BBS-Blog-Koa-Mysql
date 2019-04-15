const KoaRouter = require('koa-router');
const router = new KoaRouter();
const editBoard = require('../../lib/boards');
const editTopic = require('../../lib/topics');


//帖子管理--管理员
router.get("/admin/manageTopics/:id", async (ctx) => {  //路由
	const listBoardPromise = editBoard.listBoardAll();
	const listBoard = await listBoardPromise;

	const allTopicPromise = editTopic.listAllTopic();
	const allTopic = await allTopicPromise;

	const listStarTopicPromise = editTopic.listStarTopic();
	const listStarTopic = await listStarTopicPromise;

	const listTopTopicPromise = editTopic.listTopTopic();
	const listTopTopic = await listTopTopicPromise;

	const id = ctx.params.id;
	const listTopicPromise = editTopic.listTopic(id);
	const listTopic = await listTopicPromise;
	await ctx.render("/admin/topics", {
		layout: 'layouts/layout_admin',
		id: id,
		listBoard: listBoard,
		allTopic: allTopic,
		listTopTopic: listTopTopic,
		listStarTopic: listStarTopic,
		listTopic: listTopic,
	});
});

//  伪删除帖子
router.get("/admin/manageTopics/all/delete/:id", async (ctx) => {
	const id = ctx.params.id;
	const deleteTopicPromise = editTopic.deleteTopicById(id);
	await deleteTopicPromise;
	ctx.redirect("/admin/manageTopics/all");
});

//  小黑屋 ---- 恢复帖子
router.get("/admin/blackHouse/out/topic/:id", async (ctx) => {
	const id = ctx.params.id;
	const outTopicPromise = editTopic.outTopic(id);
	await outTopicPromise;
	ctx.redirect("/admin/manageTopics/all");
});

//  小黑屋 ---- 彻底删除帖子
router.get("/admin/blackHouse/delete/topic/:id", async (ctx) => {
	const id = ctx.params.id;
	const deleteCompeteTopicPromise = editTopic.deleteCompeteTopic(id);
	await deleteCompeteTopicPromise;
	ctx.redirect("/admin/blackHouse");
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

router.post("/admin/manageTopics/all", async (ctx) => {
	const postBody = ctx.request.body;
	const buttonValue = postBody.buttonValue;
	const buttonDataId = postBody.buttonDataId;
	// console.log(postBody);
	switch(buttonValue) {
		case "Delete":
			const deleteTopicByIdPromise = editTopic.deleteTopicById(buttonDataId);
			await deleteTopicByIdPromise;
			ctx.body = {msg: "Delete success"};
			break;
		case "Set top":
			const setTopTopicPromise = editTopic.setTopTopic(buttonDataId);
			await setTopTopicPromise;
			ctx.body = {msg: "Set top success"};
			break;
		case "Cancel top":
			const reduceTopTopicPromise = editTopic.reduceTopTopic(buttonDataId);
			await reduceTopTopicPromise;
			ctx.body = {msg: "Cancel top success"};
			break;
		case "Set star":
			const setStarTopicPromise = editTopic.setStarTopic(buttonDataId);
			await setStarTopicPromise;
			ctx.body = {msg: "Set star success"};
			break;
		case "Cancel star":
			const reduceStarTopicPromise = editTopic.reduceStarTopic(buttonDataId);
			await reduceStarTopicPromise;
			ctx.body = {msg: "Cancel star success"};
			break;
	}

});



module.exports = router;

