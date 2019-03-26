const KoaRouter = require('koa-router');
const router = new KoaRouter();
const db = require('../database');
//获取用户在form表单中输入的数据，判断是否合乎规则，如果正确则将数据存入数据库
router.post('/signUp', async(ctx) => {
	const username = ctx.request.body.username; //获取用户输入的名字
	const email = ctx.request.body.email;  //获取用户输入的邮箱地址
	const password = ctx.request.body.password; 
	const user = ctx.request.body;
	const data = [username, email, password];
	db.getUserByUsername(data);
	ctx.session.user = user;
	ctx.redirect('/signUp');
});

router.get("/signUp", async(ctx) => {  //路由
	await ctx.render('/signUp', {
		layout: "layouts/layout_login"
	});
});

module.exports = router;

