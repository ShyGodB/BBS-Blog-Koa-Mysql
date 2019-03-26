const KoaRouter = require('koa-router');
const router = new KoaRouter();
const db = require('../database');


// 此模块为管理员操作


// 管理员用户登录
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
// 管理员登录
router.post('/', async (ctx) => {
	const username = ctx.request.body.adminName;
	const password = ctx.request.body.adminPassword;
	if (username === 'admin' && password === 'admin') {
		ctx.redirect('/admin');
	} else {
		ctx.body = '登录失败';
	}
});



// 子论坛操作

// 后台显示所有子论坛
router.get("/admin/boardManagement/showChildBoards", async (ctx) => {  //路由
	const listChildBBSPromise = db.listChildBBSAll();
	const listChildBBS = await listChildBBSPromise;
	await ctx.render("/admin/showChildBoards", {
		layout: 'layouts/layout_admin',
		listChildBBS: listChildBBS
	});
});

// 管理员创建新的子论坛 ---- get
router.get("/admin/boardManagement/createChildBoard", async (ctx) => {  //路由
	await ctx.render("/admin/createChildBoard", {
		layout: 'layouts/layout_admin'
	});
});

// 创建子论坛 ---- post
router.post('/createChildBoard', async (ctx) => {
	const child_bbs = ctx.request.body.child_bbs;
	const listChildBBSPromise = db.listChildBBS();
	const listChildBBS = await listChildBBSPromise; //得到的是所有类别子论坛
	let existBBSArray = [];
	listChildBBS.forEach(async (bbs) => {
		existBBSArray.push(bbs.child_bbs);
	});
	if(existBBSArray.length === 0) {
		await db.addChildBBS(child_bbs);
		console.log('创建子论坛成功');
		ctx.redirect('/admin/boardManagement/manageChildBoards');
	} else {
		if(existBBSArray.indexOf(child_bbs) !== -1) {
			console.log('创建失败，该子论坛已存在，请重新创建!');
			ctx.redirect('/admin/boardManagement/createChildBoard');
		} else {
			db.addChildBBS(child_bbs);
			console.log('创建成功');
			ctx.redirect('/admin/boardManagement/manageChildBoards');
		}
	}
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

