const KoaRouter = require('koa-router');
const router = new KoaRouter();
const editUser = require('../../lib/users');

// 管理员登录
router.get("/sjdfj2i348u2hafsabjkasjknashqioq2u@ijsdfaf8438478fhjvnvabjnk/admin", async (ctx) => {  //路由
	await ctx.render("/admin/admin", {
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

router.get("/admin/manageuUsers/all", async (ctx) => {
	const listAlluserPromise = editUser.listAlluser();
	const allUser = await listAlluserPromise;
	await ctx.render("/admin/users", {
		allUser: allUser,
		layout: 'layouts/layout_admin',
	});
});


router.get("/admin/manageUsers/delete/:id", async (ctx) => {
	const id = ctx.params.id;
	const deleteUserPromise = editUser.deleteUser(id);
	await deleteUserPromise;
	ctx.session.user = null;
	ctx.redirect("/admin/manageuUsers/all");
});


module.exports = router;

