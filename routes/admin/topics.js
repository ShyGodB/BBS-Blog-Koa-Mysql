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

//  小黑屋 ---- 彻底删除帖子
router.get("/admin/blackHouse/delete/topic/:id", async (ctx) => {
	const id = ctx.params.id;
	const deleteCompeteTopicPromise = editTopic.deleteCompeteTopic(id);
	await deleteCompeteTopicPromise;
	ctx.redirect("/admin/blackHouse");
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

