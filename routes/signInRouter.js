const KoaRouter = require('koa-router');
const router = new KoaRouter();
const db = require('../database');
//获取用户在form表单中输入的数据，并将其与数据库中储存的信息进行对比以判断是否允许该用户登录
router.post('/signIn', async(ctx) => {
	const email = ctx.request.body.email;  //获取用户输入的邮箱地址
	const password = ctx.request.body.password;  //获取用户输入的密码
	const rowsPromise = db.userLogin(email, password);
	const rows = await rowsPromise;
	const usersPromise = db.getUsernameByEmail(email);
	const users = await usersPromise;
	const user = users[0];
	if (rows.length !== 0 && (rows[0].email === email && rows[0].password === password)) {
		console.log('登录成功');
		ctx.session.user = user;
		ctx.redirect('/');
	} else {
		console.log('登录失败');
	}  
});

router.get("/signIn", async(ctx) => {  //路由
	await ctx.render("/signIn", {
		layout: "layouts/layout_login",
	});
}); 

router.get("/signOut", async (ctx) => { //路由
    ctx.session.user = null;
    ctx.redirect('/signIn');
});

module.exports = router;