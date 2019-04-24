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

			const date = new Date();
			const registerTime = date.toLocaleString();
			const loginTime = registerTime

			const data = [username1, email1, password1, registerTime, loginTime];
			const addUserPromise = editUser.addUser(data);
			await addUserPromise;

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
	if(rows.length === 0) {
			ctx.body = {msg: "Incorrect username or password."}
	} else {
		const date = new Date();
		const loginTime = date.toLocaleString();
		const id = rows[0].id;

		const lastLoginTime = rows[0].login_time;

		const data1 = [lastLoginTime, loginTime, id];
		const updateLoginTimePromise = editUser.updateLoginTime(data1);
		await updateLoginTimePromise;

		const usersPromise = editUser.getUsernameByEmail(email);
		const users = await usersPromise;
		const user = users[0];

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
	const lastMsg = ctx.session.user.last_msg;

	const getMsgTopicIdPromise = editMessage.getMsgTopicId(lastMsg);
	const msgTopicIdArray = await getMsgTopicIdPromise;
	const msgTopicId = msgTopicIdArray[0].topic_id;

	const username = ctx.session.user.username;
	const listTopicIdPromise = editTopic.listTopicId(username);
	const listTopicId = await listTopicIdPromise;
	const topicId = listTopicId[listTopicId.length-1].id;

	const getUserByIdPromise = editUser.getUserById(id);
	const userArray = await getUserByIdPromise;

	const user = userArray[0];
	await ctx.render("/userSetting/userhome", {
		user: user,
		topicId: topicId,
		msgTopicId: msgTopicId,
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
	const id = user.id;
	const title = ctx.request.body.title;
	const boardId = ctx.request.body.select_current_value;

	const getBoardPromise = editBoard.getBoard(boardId);
	const boardArray = await getBoardPromise;
	const boardName = boardArray[0].board_name;
	const article = ctx.request.body.article;
	// console.log(boardId);
	const date = new Date();
	const postTime = date.toLocaleString();
	const data1 = [postTime, title, id];

	const updatePostInformationPromise = editUser.updatePostInformation(data1);
	await updatePostInformationPromise;

	const getUserPromise = editUser.getUserById(id);
	const updatedUserArray = await getUserPromise;
	const updatedUser = updatedUserArray[0]
	ctx.session.user = updatedUser;


	const topicImagePath = user.picpath;
	const postMan = user.username;
	const data = [title, boardId, article, topicImagePath, postMan, boardName];
	const addTopicPromise = editTopic.addTopic(data);
	await addTopicPromise;
	ctx.redirect('/');
});

// 用户留言
router.post('/showTopics/all/:id', async (ctx) => {
	const postData = ctx.request.body;
	const id = postData.id;
	const message = postData.message;
	const user = ctx.session.user;
	const messagePeople = user.username;
	const messagePicPath = user.picpath;
	const data = [id, message, messagePeople, messagePicPath];


	const userId = user.id;
	const date = new Date();
	const msgTime = date.toLocaleString();
	const data1 = [msgTime, message, userId];

	const updateMsgInformationPromise = editUser.updateMsgInformation(data1);
	await updateMsgInformationPromise;

	const getUserPromise = editUser.getUserById(userId);
	const updatedUserArray = await getUserPromise;
	const updatedUser = updatedUserArray[0];
	ctx.session.user = updatedUser;

	// 将新的留言存入数据库
	const addMessagePromise = editMessage.addMessage(data);
	await addMessagePromise;

	const getMsgNumPromise = editMessage.getMsgNum(id);
	const msgNumArray = await getMsgNumPromise;
	const msgNum = msgNumArray.length;

	const data2 = [msgNum, id];
	const updateTopicMsgNumPromise = editTopic.updateTopicMsgNum(data2);
	await updateTopicMsgNumPromise;

	ctx.body = data;
});


module.exports = router;




