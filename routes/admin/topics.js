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

//  小黑屋 ---- 恢复帖子
router.get("/admin/blackHouse/out/topic/:id", async (ctx) => {
	const id = ctx.params.id;
	const outTopicPromise = editTopic.outTopic(id);
	await outTopicPromise;
	ctx.redirect("/admin/manageTopics/all");
});


router.post("/admin/manageTopics/all", async (ctx) => {
	// 获取前端发送过来的数据
	const postBody = ctx.request.body;
	// 获取buttonValue，通过这个来判断用户进行的是哪种操作
	const buttonValue = postBody.buttonValue;
	// 获取buttonDataId，这个其实就是topic的id
	const buttonDataId = postBody.buttonDataId;
	// 使用switch判断buttonValue
	switch(buttonValue) {
		// buttonValue === "Delete"
		case "Delete":
			// 操作数据库，将id为buttonDataId的topic的useful设置为0
			// 即伪删除该topic，该topic会在后面的小黑屋中显示
			const deleteTopicByIdPromise = editTopic.deleteTopicById(buttonDataId);
			await deleteTopicByIdPromise;
			// 返回数据到前端
			ctx.body = {msg: "Delete success"};
			break;
		// buttonValue === "Set top"
		case "Set top":
			// 操作数据库，将id为buttonDataId的topic的top设置为1，即置顶帖子
			const setTopTopicPromise = editTopic.setTopTopic(buttonDataId);
			await setTopTopicPromise;
			// 返回数据到前端
			ctx.body = {msg: "Set top success"};
			break;
		// buttonValue === "Cancel top"
		case "Cancel top":
			// 操作数据库，将id为buttonDataId的topic的top设置为0，即取消置顶
			const reduceTopTopicPromise = editTopic.reduceTopTopic(buttonDataId);
			await reduceTopTopicPromise;
			// 返回数据到前端
			ctx.body = {msg: "Cancel top success"};
			break;
		// buttonValue === "Set star"
		case "Set star":
			// 操作数据库，将id为buttonDataId的topic的star设置为1，即设置精华帖子
			const setStarTopicPromise = editTopic.setStarTopic(buttonDataId);
			await setStarTopicPromise;
			// 返回数据到前端
			ctx.body = {msg: "Set star success"};
			break;
		// buttonValue === "Cancel star"
		case "Cancel star":
			// 操作数据库，将id为buttonDataId的topic的star设置为0，即设取消精华帖子
			const reduceStarTopicPromise = editTopic.reduceStarTopic(buttonDataId);
			await reduceStarTopicPromise;
			// 返回数据到前端
			ctx.body = {msg: "Cancel star success"};
			break;
	}

});



module.exports = router;

