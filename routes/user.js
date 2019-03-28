const KoaRouter = require('koa-router');
const router = new KoaRouter();
const db = require('../database');
const multer = require('koa-multer');
const upload = multer({ dest: 'public/uploads/' });


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
	const id = ctx.session.user.id;
	const getUserPromise = db.getUserById(id);
	const user = await getUserPromise;
	await ctx.render("/userSetting/userHome", {
		user: user
	});
});

// 用户设置 ---- 个人设置
router.get("/settings/profile", async (ctx) => { //路由
	const path = ctx.params.path;
	await ctx.render('/userSetting/profile', {
		layout: "layouts/layout_user_settings",
		path: path,
		user: ctx.session.user
	});
});

// 用户设置个人信息
router.post("/Settings/profile", async (ctx) => {
	const nickname = ctx.request.body.nickname;
	const birthday = ctx.request.body.birthday;
	const gender = ctx.request.body.gender;
	const bio = ctx.request.body.bio;
	const id = ctx.session.user.id;
	const data = [nickname, birthday, gender, bio, id];
	const setProfilePromise = db.setProfile(data);
	await setProfilePromise;
	ctx.redirect("/userHome");
})

// 联系信息设置
router.get("/settings/connection", async (ctx) => { //路由
	const path = ctx.params.path;
	await ctx.render('/userSetting/connection', {
		layout: "layouts/layout_user_settings",
		path: path,
		user: ctx.session.user
	});
});

// 用户设置联系信息
router.post("/Settings/connection", async (ctx) => {
	const telephone = ctx.request.body.telephone;
	const email = ctx.request.body.email;
	const qq = ctx.request.body.qq;
	const wechatId = ctx.request.body.wechatId;
	const id = ctx.session.user.id;
	const data = [telephone, email, qq, wechatId, id];
	const setConnectionPromise = db.setConnection(data);
	await setConnectionPromise;
	ctx.redirect("/userHome");
})

// 设置头像
router.get("/settings/profile/changeImage", async (ctx) => {
	await ctx.render("/changeImage", {
		layout: '/layouts/layout_cutImage',
		user: ctx.session.user
	});
});
router.post("/settings/profile/changeImage", upload.single('image'), async (ctx) => {
	//console.log(ctx.req.file);
	const picPath = ctx.req.file.path;
	const id = ctx.session.user.id;
	const data=[picPath, id];
	const resetPicturePromise = db.resetPicture(data);
	await resetPicturePromise;
	ctx.redirect('/userHome');
});

// 用户高级设置-- 暂时就只有重置密码
router.post("/Settings/advanced", async (ctx) => {
	const oldPassword = ctx.request.body.oldPassword;
	const newPassword1 = ctx.request.body.newPassword1;
	const newPassword2 = ctx.request.body.newPassword2;
	const id = ctx.session.user.id;
	const getUserPromise = db.getUserById(id);
	const user = await getUserPromise;
	const userPassword = user[0].password; //得到该用户的初始密码
	const data = [newPassword2, id]
	if(oldPassword !== userPassword) {
		console.log('你输入的旧密码不正确，请重新输入');
		ctx.redirect("/settings/advanced");
	} else {
		if(newPassword1 !== newPassword2) {
			console.log('你2次输入的新密码不一致，请重新输入')
			ctx.redirect("/settings/advanced");
		} else {
			const resetPasswordPromise = db.resetPassword(data);
			await resetPasswordPromise;
			console.log('恭喜你，修改密码成功，请牢记你的新密码！');
			ctx.redirect("/userHome");

		}
	}
})



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

