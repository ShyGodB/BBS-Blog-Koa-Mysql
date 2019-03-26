const KoaRouter = require('koa-router');
const router = new KoaRouter();
const db = require('../database');


// 管理员操作
// 后台显示所有子论坛
//  管理员用户登录
router.get("/admin", async (ctx) => {  //路由
	const path = ctx.params.path;
	const list_child_bbs_promise = db.listChildBBSAll();
	const list_child_bbs = await list_child_bbs_promise;
	await ctx.render("/admin/admin" +
		"", {
		layout: 'layouts/layout_admin',
		path: path,
		list_child_bbs: list_child_bbs
	});
});

router.get("/admin/boardManagement/showChildBoards", async (ctx) => {  //路由
	const listChildBBSPromise = db.listChildBBSAll();
	const listChildBBS = await listChildBBSPromise;
	await ctx.render("/admin/showChildBoards", {
		layout: 'layouts/layout_admin',
		listChildBBS: listChildBBS
	});
});

// 管理员创建新的子论坛
router.get("/admin/boardManagement/createChildBoard", async (ctx) => {  //路由
	await ctx.render("/admin/createChildBoard", {
		layout: 'layouts/layout_admin'
	});
});

// 管理子论坛
router.get("/admin/boardManagement/manageChildBoards", async (ctx) => {  //路由
	const path = ctx.params.path;
	const listChildBBSPromise = db.listChildBBSAll();
	const listChildBBS = await listChildBBSPromise;
	await ctx.render("/admin/manageChildBoards", {
		layout: 'layouts/layout_admin',
		path: path,
		listChildBBS: listChildBBS
	});
});

// 删除子论坛
router.get("/admin/boardManagement/manageChildBoards/:id", async (ctx) => {
	const id = ctx.params.id;
	const deletePromise = db.deleteChildBoardById(id);
	await deletePromise;
	ctx.redirect("/admin/boardManagement/showChildBoards");
});

//  删除帖子
router.get("/admin/allTopicManagement/manageTopics/all/:id", async (ctx) => {
	const id = ctx.params.id;
	const deleteTopicPromise = db.deleteTopicById(id);
	await deleteTopicPromise;
	ctx.redirect("/admin/allTopicManagement/manageTopics/all");
});

//  设置精华帖子
router.get("/admin/allTopicManagement/all/:id", async (ctx) => {
	const id = ctx.params.id;
	const setStarPromise = db.setStarTopic(id);
	await setStarPromise;
	ctx.redirect("/admin/allTopicManagement/manageTopics/star");
});

//  取消精华帖子
router.get("/admin/allTopicManagement/star/:id", async (ctx) => {
	const id = ctx.params.id;
	const reduceStarPromise = db.reduceStarTopic(id);
	await reduceStarPromise;
	ctx.redirect("/admin/allTopicManagement/manageTopics/star");
});


//帖子管理--管理员
router.get("/admin/allTopicManagement/manageTopics/:topicType", async (ctx) => {  //路由
	const childBBSPromise = db.listChildBBS();
	const childBBS = await childBBSPromise;
	const allTopicPromise = db.listAllTopicFromBBS();
	const allTopic = await allTopicPromise;
	const listStarTopicPromise = db.listStarTopic();
	const listStarTopic = await listStarTopicPromise;
	const topicType = ctx.params.topicType;
	const listTopicByTopicTypePromise = db.listTopicByTopicType(topicType);
	const listTopicByTopicType = await listTopicByTopicTypePromise;
	await ctx.render("/admin/manageTopics", {
		layout: 'layouts/layout_admin',
		topicType: topicType,
		childBBS: childBBS,
		allTopic: allTopic,
		listStarTopic: listStarTopic,
		listTopicByTopicType: listTopicByTopicType,
	});
});

//  管理置顶的帖子
router.get("/admin/allTopicManagement/:path", async (ctx) => {  //路由
	const path = ctx.params.path;
	const allTopicPromise = db.listAllTopicFromBBS();
	const allTopic = await allTopicPromise;
	const listTopTopicPromise = db.listTopTopic();
	const listTopTopic = await listTopTopicPromise;
	await ctx.render("/admin/manageTopTopics", {
		path: path,
		allTopic: allTopic,
		listTopTopic: listTopTopic,
		layout: 'layouts/layout_admin'
	});
});

//  设置置顶帖子
router.get("/admin/allTopicManagement/manageTopTopics/all/:id", async (ctx) => {
	const id = ctx.params.id;
	const setTopTopicPromise = db.setTopTopic(id);
	await setTopTopicPromise;
	ctx.redirect("/admin/allTopicManagement/top");
});
//  取消置顶帖子
router.get("/admin/allTopicManagement/manageTopTopics/top/:id", async (ctx) => {
	const id = ctx.params.id;
	const reduceTopTopicPromise = db.reduceTopTopic(id);
	await reduceTopTopicPromise;
	ctx.redirect("/admin/allTopicManagement/top");
});


module.exports = router;

