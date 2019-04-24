const KoaRouter = require('koa-router');
const router = new KoaRouter();
const editUser = require('../../lib/users');
const editBoard = require('../../lib/boards');
const editTopic = require('../../lib/topics');

// 管理员登录
router.get("/sjdfj2i348u2hafsabjkasjknashqioq2u@ijsdfaf8438478fhjvnvabjnk/admin", async (ctx) => {  //路由
	const listAllTopicPromise = editTopic.listAllTopic();
	const allTopic = await listAllTopicPromise;

	const listAllBoardPromise = editBoard.listAllBoard();
	const allBoard = await listAllBoardPromise;

	const listAllUserPromise = editUser.listAllUser();
	const allUser = await listAllUserPromise;
	await ctx.render("/admin/admin", {
		allUser: allUser,
		allBoard: allBoard,
		allTopic: allTopic,
		layout: 'layouts/layout_admin'
	});
});

// 管理员登录
router.post('/', async (ctx) => {
	const username = ctx.request.body.adminName;
	const password = ctx.request.body.adminPassword;
	if (username === 'admin' && password === 'admin') {
		ctx.redirect('/sjdfj2i348u2hafsabjkasjknashqioq2u@ijsdfaf8438478fhjvnvabjnk/admin');
	} else {
		ctx.body = '登录失败';
	}
});


// 管理用户
router.get("/admin/manageUsers/all", async (ctx) => {
	// 操作数据库，选取所有useful字段为1的用户
	const listAlluserPromise = editUser.listAlluser();
	const allUser = await listAlluserPromise;
	// 渲染页面
	await ctx.render("/admin/users", {
		allUser: allUser,
		layout: 'layouts/layout_admin',
	});
});

// 伪删除用户
router.get("/admin/manageUsers/delete/:id", async (ctx) => {
	const id = ctx.params.id;
	const delUserPromise = editUser.deleteUser(id);
	await delUserPromise;
	ctx.redirect("/admin/blackHouse");
});

// 小黑屋 ---- 管理伪删除的内容
router.get("/admin/blackHouse", async (ctx) => {
	const listDelBoardPromise = editBoard.listDelBoard();
	const listDelBoard = await listDelBoardPromise;

	const listDelUserPromise = editUser.listDelUser();
	const listDelUser = await listDelUserPromise;

	const listDelTopicPromise = editTopic.listDelTopic();
	const listDelTopic = await listDelTopicPromise;

	await ctx.render("/admin/black_house", {
		layout: 'layouts/layout_admin',
		listDelUser: listDelUser,
		listDelBoard: listDelBoard,
		listDelTopic: listDelTopic
	});
});

// 小黑屋 ---- 恢复子用户
router.get("/admin/blackHouse/out/user/:id", async (ctx) => {
	const id = ctx.params.id;
	const outUserPromise = editUser.outUser(id);
	await outUserPromise;
	await ctx.redirect("/admin/manageUsers/all");
});


module.exports = router;

