const KoaRouter = require('koa-router');
const router = new KoaRouter();
const db = require('../lib/database');


// 此模块为管理员操作


// 管理员用户登录
router.get("/admin", async (ctx) => {  //路由
	const path = ctx.params.path;
	const list_child_bbs_promise = db.listChildBBSAll();
	const list_child_bbs = await list_child_bbs_promise;
	await ctx.render("/admin/admin", {
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

// 管理子论坛
router.get("/admin/manageBoards", async (ctx) => {  //路由
	const path = ctx.params.path;
	const listBoardPromise = db.listChildBBSAll();
	const listBoard = await listBoardPromise;
	await ctx.render("/admin/manageBoards", {
		layout: 'layouts/layout_admin',
		path: path,
		listBoard: listBoard
	});
});

// 创建子论坛 ---- post
router.post('/admin/manageBoards', async (ctx) => {
	const newBoardName = ctx.request.body.newBoardName;
	const listBoardsPromise = db.listChildBBS();
	const listBoard = await listBoardsPromise; //得到的是所有类别子论坛
	let existBoardArray = [];
	listBoard.forEach(async (board) => {
		existBoardArray.push(board.board_name);
	});
	if(existBoardArray.length === 0) {
		await db.addChildBBS(newBoardName);
		console.log('创建子论坛成功');
		ctx.redirect('/admin/manageBoards');
	} else {
		if(existBoardArray.indexOf(newBoardName) !== -1) {
			console.log('创建失败，该子论坛已存在，请重新创建!');
			ctx.redirect('/admin/manageBoards');
		} else {
			db.addChildBBS(newBoardName);
			console.log('创建成功');
			ctx.redirect('/admin/manageBoards');
		}
	}
});

// 删除子论坛
router.get("/admin/manageBoards/delete/:id", async (ctx) => {
	const id = ctx.params.id;
	const deletePromise = db.deleteChildBoardById(id);
	await deletePromise;
	ctx.redirect("/admin/manageBoards");
});

// 子论坛重命名
router.post("/admin/manageBoards/:id", async (ctx) => {
	const newName = ctx.request.body.newName;
	const id = ctx.params.id;
	console.log(id)
	const data = [newName, id];
	const renamePromise = db.renameBoardById(data);
	await renamePromise;
	ctx.redirect("/admin/manageBoards");
});



//帖子管理--管理员
router.get("/admin/manageTopics/:topicType", async (ctx) => {  //路由
	const listBoardPromise = db.listChildBBS();
	const listBoard = await listBoardPromise;
	const allTopicPromise = db.listAllTopicFromBBS();
	const allTopic = await allTopicPromise;
	const listStarTopicPromise = db.listStarTopic();
	const listStarTopic = await listStarTopicPromise;
	const listTopTopicPromise = db.listTopTopic();
	const listTopTopic = await listTopTopicPromise;
	const topicType = ctx.params.topicType;
	const listTopicByTopicTypePromise = db.listTopicByTopicType(topicType);
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
	const deleteTopicPromise = db.deleteTopicById(id);
	await deleteTopicPromise;
	ctx.redirect("/admin/manageTopics/all");
});

//  设置精华帖子
router.get("/admin/manageTopics/all/setStar/:id", async (ctx) => {
	const id = ctx.params.id;
	const setStarPromise = db.setStarTopic(id);
	await setStarPromise;
	ctx.redirect("/admin/manageTopics/star");
});

//  取消精华帖子
router.get("/admin/manageTopics/all/cancelStar/:id", async (ctx) => {
	const id = ctx.params.id;
	const reduceStarPromise = db.reduceStarTopic(id);
	await reduceStarPromise;
	ctx.redirect("/admin/manageTopics/star");
});



//  设置置顶帖子
router.get("/admin/manageTopics/all/setTop/:id", async (ctx) => {
	const id = ctx.params.id;
	console.log(id)
	const setTopTopicPromise = db.setTopTopic(id);
	await setTopTopicPromise;
	ctx.redirect("/admin/manageTopics/top");
});

//  取消置顶帖子
router.get("/admin/manageTopics/all/cancelTop/:id", async (ctx) => {
	const id = ctx.params.id;
	const reduceTopTopicPromise = db.reduceTopTopic(id);
	await reduceTopTopicPromise;
	ctx.redirect("/admin/manageTopics/top");
});

module.exports = router;

