const KoaRouter = require('koa-router');
const router = new KoaRouter();
const editBoard = require('../lib/boards');

// 管理员登录
router.get("/admin", async (ctx) => {  //路由
	const path = ctx.params.path;
	const listBoardPromise = editBoard.listChildBBSAll();
	const listBoard = await listBoardPromise;
	await ctx.render("/admin/admin", {
		path: path,
		listBoard: listBoard,
		layout: 'layouts/layout_admin'
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

module.exports = router;

