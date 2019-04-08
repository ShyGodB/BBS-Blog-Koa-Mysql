const KoaRouter = require('koa-router');
const router = new KoaRouter();
const editUser = require('../../lib/users');
const editBoard = require('../../lib/boards');
const editTopic = require('../../lib/topics');
const editMessage = require('../../lib/message');

// 用户注册
router.get("/signUp", async(ctx) => {  //路由
	await ctx.render('/signUpIn/sign_up', {
		layout: "layouts/layout_signUp"
	});
});

// 用户注册 -- 获取用户在form表单中输入的数据，判断是否合乎规则，如果正确则将数据存入数据库
router.post('/signUp', async(ctx) => {
	const postData = ctx.request.body;
	const labelValue = postData.labelValue
	switch(labelValue) {
		case "Username":
			const username = postData.username;
			const getUserByUsernamePromise = editUser.getUserByUsername(username);
			const row1 = await getUserByUsernamePromise;
			if(row1.length !== 0) {
				ctx.body = {msg: "用户名已被占用，请重新输入"};
			} else {
				ctx.body = {msg: "此用户名可以使用"};
			}
			break;
		case "Email address":
			const email = postData.email;
			const ggetUserByEmailPromise = editUser.getUserByEmail(email);
			const row2 = await ggetUserByEmailPromise;
			if(row2.length !== 0) {
				ctx.body = {msg: "用邮箱已被占用，请重新输入"};
			} else {
				ctx.body = {msg: "此邮箱可以使用"};
			}
			break;
		case "Sign up":
			const username1 = postData.username;
			const email1 = postData.email;
			const password1 = postData.password;
			const data = [username1, email1, password1];
			const addUserDataPromise = editUser.addUserData(data);
			await addUserDataPromise;

			const usersPromise = editUser.getUsernameByEmail(email1);
			const users = await usersPromise;
			const user = users[0];

			ctx.session.user = user;
			ctx.body = {msg: "注册成功"}

			break;
	}
})

// 用户登录
router.get("/signIn", async(ctx) => {  //路由
	await ctx.render("/signUpIn/sign_in", {
		layout: "layouts/layout_login",
	});
});

//获取用户在form表单中输入的数据，并将其与数据库中储存的信息进行对比以判断是否允许该用户登录
router.post('/signIn', async(ctx) => {
	const postData = ctx.request.body;
	const email = postData.inputEmail;  //获取用户输入的邮箱地址
	const password = postData.inputPassword;  //获取用户输入的密码
	const data = [email, password];

	const rowsPromise = editUser.userLogin(data);
	const rows = await rowsPromise;

	const usersPromise = editUser.getUsernameByEmail(email);
	const users = await usersPromise;
	const user = users[0];

	if(rows.length === 0) {
			ctx.body = {msg: "Incorrect username or password."}
	} else {
		ctx.session.user = user;
		ctx.body = {msg: "登录成功"}
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
	await ctx.render("/userSetting/userhome", {
		user: user,
		layout: "layouts/layout_userhome"
	});
});

//  用户发表帖子
router.get("/postTopic", async (ctx) => {  //路由
	const listBoardPromise = editBoard.listBoardAll();
	const listBoard = await listBoardPromise;
	await ctx.render("/topics/post_topic", {
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
	const data = [title, board_name, article, topicImagePath, postMan];
	const addTopicPromise = editTopic.addTopic(data);
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
	const saveMessageToTableMessagePromise = editMessage.addMessage(data);
	await saveMessageToTableMessagePromise;
	const targetAdress = `/showTopics/all/${topicId}`;
	ctx.redirect(targetAdress);
});

module.exports = router;




