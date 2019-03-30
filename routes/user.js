const KoaRouter = require('koa-router');
const router = new KoaRouter();
const db = require('../lib/database');
const multer = require('koa-multer');
const upload = multer({ dest: 'public/uploads/' });
const fs = require('fs');

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
	const data = [username, email, password];
	const getUserByUsernamePromise = db.getUserByUsername(username);
	const row1 = await getUserByUsernamePromise;
	if(row1.length !== 0) {
		console.log("注册失败，用户名重复，请重新输入");
	} else {
		const getUserByEmailPromise = db.getUserByEmail(email);
		const row2 = await getUserByEmailPromise;
		if(row2.length !== 0) {
			console.log("注册失败，邮箱账号重复，请重新输入");
		} else {
			const addUserDataPromise = db.addUserData(data);
			await addUserDataPromise;
			const getUserByUsernamePromise = db.getUserByUsername(username);
			const row4 = await getUserByUsernamePromise;
			ctx.session.user = row4[0];
		}
	}
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
		console.log(user)
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
});

// 设置头像
router.get("/settings/profile/changeImage", async (ctx) => {
	await ctx.render("/userSetting/changeImage", {
		layout: '/layouts/layout_cutImage',
		user: ctx.session.user
	});
});

router.post("/settings/profile/changeImage", upload.single('image'), async (ctx) => {
	const value = ctx.req.body.upload_base;
	const base64Data = value.replace(/^data:image\/\w+;base64,/, "");
	const dataBuffer = Buffer.from(base64Data, 'base64');
	const userId = ctx.session.user.id;
 	const newUserPicturePath = `public/uploads/${userId}.png`;
	fs.writeFile (newUserPicturePath, dataBuffer, function(err) {
		if (err) {
			console.log(err);
		}else{
			console.log("保存成功！");
		}
	});
	const id = ctx.session.user.id;
	const data=[newUserPicturePath, id];
	const resetPicturePromise = db.resetPicture(data);
	await resetPicturePromise; //新的头像路径保存完成，但是要更新session才能使头像立即生效
	const getUserInformationPromise = db.getUserById(id);
	const userArray = await getUserInformationPromise;
	const user = userArray[0];
	ctx.session.user = user;

	// 在用户更新头像完成后，我们要将数据库中该用户发表的所有话题的topic_image_path
	// 换成该用户当前头像的路径，即 --> newUserPicturePath
	// 根据数据表topic中的每条topic的post_man字段我们可以得到发表该话题的用户，因为用户名唯一
	// 其实在这里用户名就是当前用户的username属性，因为session、更新，所以我们也用新的,
	// 即ctx.session.user.username. 其实它 === user.username
	// const userName = ctx.session.user.username;
	// const data2 = [newUserPicturePath, userName]
    // const updateTopicImagePathByPostManPromise = db.updateTopicImagePathByPostMan(data2);
    // await updateTopicImagePathByPostManPromise;
	// 同上，用户更换头像，该用户留言前的图片也应该换
	// const data3 = [newUserPicturePath, userName];
	// const updateMessageImagePathByMessagePeoplePromise = db.updateMessageImagePathByMessagePeople(data3);
	// await updateMessageImagePathByMessagePeoplePromise;
	ctx.redirect('/userHome');
});

// 用户高级设置-- 暂时就只有重置密码
router.get("/settings/advanced", async (ctx) => { //路由
	const path = ctx.params.path;
	await ctx.render('/userSetting/advanced', {
		layout: "layouts/layout_user_settings",
		path: path,
		user: ctx.session.user
	});
});

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
});

//  用户发表帖子
router.get("/postTopic", async (ctx) => {  //路由
	const listChildBBSPromise = db.listChildBBSAll();
	const listChildBBS = await listChildBBSPromise;
	await ctx.render("/topics/postTopic", {
		user: ctx.session.user,
		listChildBBS: listChildBBS
	});
});

// 发表帖子
router.post('/postTopic', async (ctx) => {
	const user = ctx.session.user;
	const childBBS = ctx.request.body.select_current_value;
	const title = ctx.request.body.title;
	const article = ctx.request.body.article;
	const topicImagePath = user.picpath;
	const postMan = user.username;
	const data = [title, childBBS, article, topicImagePath, postMan];
	await db.addTopicToDatabase(data);
	ctx.redirect('/');
});

// 添加留言
router.post('/:id/reply', async (ctx) => {
	//console.log(ctx.session.user);
	const user = ctx.session.user;
	const message_people = user.username;
	const message_picpath = user.picpath;
	// 拿到当前页面显示话题的id
	const topicId = ctx.params.id;
	// 拿到当前页面用户输入的留言内容
	const messageContent = ctx.request.body.message_content;
	const data = [topicId, messageContent, message_people, message_picpath];
	const saveMessageToTableMessagePromise = db.saveMessageToTableMessage(data);
	await saveMessageToTableMessagePromise;
	const targetAdress = `/showTopics/all/${topicId}`;
	ctx.redirect(targetAdress);
});

module.exports = router;




