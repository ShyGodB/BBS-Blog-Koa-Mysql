const KoaRouter = require('koa-router');
const router = new KoaRouter();
const db = require('../database');

// 此模块为用户操作模块

// 用户注册
router.get("/signUp", async(ctx) => {  //路由
	await ctx.render('/signUpIn/signUp', {
		layout: "layouts/layout_login"
	});
});

// 用户注册 -- 获取用户在form表单中输入的数据，判断是否合乎规则，如果正确则将数据存入数据库
router.post('/signUp', async(ctx) => {
	const username = ctx.request.body.username; //获取用户输入的名字
	const email = ctx.request.body.email;  //获取用户输入的邮箱地址
	const password = ctx.request.body.password; 
	const user = ctx.request.body;
	const data = [username, email, password];
	db.getUserByUsername(data);
	ctx.session.user = user;
	ctx.redirect('/');
});

// 用户登录
router.get("/signIn", async(ctx) => {  //路由
	await ctx.render("/signUpIn/signIn", {
		layout: "layouts/layout_login",
	});
});

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

// 用户退出登录状态
router.get("/signOut", async (ctx) => { //路由
	ctx.session.user = null;
	ctx.redirect('/signIn');
});


// 请求用户主页
router.get("/userHome", async (ctx) => {
	await ctx.render("/userSetting/userHome", {
		user: ctx.session.user
	});
});

// 用户设置 ---- 基础设置
router.get("/settings/profile", async (ctx) => { //路由
	const path = ctx.params.path;
	await ctx.render('/userSetting/profile', {
		layout: "layouts/layout_user_settings",
		path: path,
		user: ctx.session.user
	});
});

// 联系信息设置
router.get("/settings/connection", async (ctx) => { //路由
	const path = ctx.params.path;
	await ctx.render('/userSetting/connection', {
		layout: "layouts/layout_user_settings",
		path: path,
		user: ctx.session.user
	});
});

// 高级设置
router.get("/settings/advanced", async (ctx) => { //路由
	const path = ctx.params.path;
	await ctx.render('/userSetting/advanced', {
		layout: "layouts/layout_user_settings",
		path: path,
		user: ctx.session.user
	});
});



//  用户发表帖子
router.get("/postTopic", async (ctx) => {  //路由
	await ctx.render("/topics/postTopic", {
		user: ctx.session.user
	});
});

// 发表帖子
router.post('/postTopic', async(ctx) => {
	const title = ctx.request.body.title;
	const topic_type = ctx.request.body.topic_type;
	const article = ctx.request.body.article;
	const data = [title, topic_type, article];
	await db.addTopicToDatabase(data);
	ctx.redirect('/')
});

// 添加留言
router.post('/showTopic', async(ctx) => {
	const article = ctx.request.body.article;
	console.log(article);
});


module.exports = router;
