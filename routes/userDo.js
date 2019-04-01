const KoaRouter = require('koa-router');
const router = new KoaRouter();
const editUser = require('../lib/users');
const editBoard = require('../lib/boards');
const editTopic = require('../lib/topics');
const editMessage = require('../lib/message');

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
	const getUserByUsernamePromise = editUser.getUserByUsername(username);
	const row1 = await getUserByUsernamePromise;
	if(row1.length !== 0) {
		console.log("注册失败，用户名重复，请重新输入");
		await ctx.redirect("/signUp");
	} else {
		const getUserByEmailPromise = editUser.getUserByEmail(email);
		const row2 = await getUserByEmailPromise;
		if(row2.length !== 0) {
			console.log("注册失败，邮箱账号重复，请重新输入");
			await ctx.redirect("/signUp");
		} else {
			console.log("注册成功");
			const addUserDataPromise = editUser.addUserData(data);
			await addUserDataPromise;
			const getUserByUsernamePromise = editUser.getUserByUsername(username);
			const row4 = await getUserByUsernamePromise;
			ctx.session.user = row4[0];
			await ctx.redirect('/');
		}
	}

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
	const rowsPromise = editUser.userLogin(email, password);
	const rows = await rowsPromise;
	const usersPromise = editUser.getUsernameByEmail(email);
	const users = await usersPromise;
	const user = users[0];
	if (rows.length !== 0 && (rows[0].email === email && rows[0].password === password)) {
		console.log('登录成功');
		ctx.session.user = user;
		console.log(ctx.session.user)
		await ctx.redirect('/');
	} else {
		console.log('登录失败');
		await ctx.redirect("/signIn");
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
	const getUserByIdPromise = editUser.getUserById(id);
	const userArray = await getUserByIdPromise;
	const user = userArray[0];
	await ctx.render("/userSetting/userHome", {
		user: user
	});
});

//  用户发表帖子
router.get("/postTopic", async (ctx) => {  //路由
	const listBoardPromise = editBoard.listChildBBSAll();
	const listBoard = await listBoardPromise;
	console.log(listBoard)
	await ctx.render("/topics/postTopic", {
		user: ctx.session.user,
		listBoard: listBoard
	});
});

// 发表帖子
router.post('/postTopic', async (ctx) => {
	const user = ctx.session.user;

	const title = ctx.request.body.title;
	const board_name = ctx.request.body.select_current_value;
	const article = ctx.request.body.article;
	const topicImagePath = user.picpath;
	const postMan = user.username;
	console.log(board_name);
	const data = [title, board_name, article, topicImagePath, postMan];
	console.log(data)
	const addTopicPromise = editTopic.addTopicToDatabase(data);
	await addTopicPromise;
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
	const saveMessageToTableMessagePromise = editMessage.saveMessageToTableMessage(data);
	await saveMessageToTableMessagePromise;
	const targetAdress = `/showTopics/all/${topicId}`;
	ctx.redirect(targetAdress);
});

module.exports = router;




