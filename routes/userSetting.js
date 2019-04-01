const KoaRouter = require('koa-router');
const router = new KoaRouter();

const editUser = require('../lib/users');
const editTopic = require('../lib/topics');
const editMessage = require('../lib/message');

const multer = require('koa-multer');
const upload = multer({ dest: 'public/uploads/' });
const fs = require('fs');



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
router.post("/settings/profile", async (ctx) => {
	const nickname = ctx.request.body.nickname;
	const birthday = ctx.request.body.birthday;
	const gender = ctx.request.body.gender;
	const bio = ctx.request.body.bio;
	const id = ctx.session.user.id;
	const data = [nickname, birthday, gender, bio, id];
	const setProfilePromise = editUser.setProfile(data);
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
router.post("/settings/connection", async (ctx) => {
	const telephone = ctx.request.body.telephone;
	const email = ctx.request.body.email;
	const qq = ctx.request.body.qq;
	const wechatId = ctx.request.body.wechatId;
	const id = ctx.session.user.id;
	const data = [telephone, email, qq, wechatId, id];
	const setConnectionPromise = editUser.setConnection(data);
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
			if(ctx.req.file) {
				const filename = ctx.req.file.filename;
				const savedFilePath = `public/uploads/${filename}`;
				fs.unlinkSync(savedFilePath);
			}
		}
	});
	const id = ctx.session.user.id;
	const data=[newUserPicturePath, id];
	const resetPicturePromise = editUser.resetPicture(data);
	await resetPicturePromise; //新的头像路径保存完成，但是要更新session才能使头像立即生效
	const getUserInformationPromise = editUser.getUserById(id);
	const userArray = await getUserInformationPromise;
	const user = userArray[0];
	ctx.session.user = user;

	// 在用户更新头像完成后，我们要将数据库中该用户发表的所有话题的topic_image_path
	// 换成该用户当前头像的路径，即 --> newUserPicturePath
	// 根据数据表topic中的每条topic的post_man字段我们可以得到发表该话题的用户，因为用户名唯一
	// 其实在这里用户名就是当前用户的username属性，因为session、更新，所以我们也用新的,
	// 即ctx.session.user.username. 其实它 === user.username
	const userName = ctx.session.user.username;
	const data2 = [newUserPicturePath, userName]
	const updateTopicImagePathByPostManPromise = editTopic.updateTopicImagePathByPostMan(data2);
	await updateTopicImagePathByPostManPromise;
	// 同上，用户更换头像，该用户留言前的图片也应该换
	const data3 = [newUserPicturePath, userName];
	const updateMessageImagePathByMessagePeoplePromise = editMessage.updateMessageImagePathByMessagePeople(data3);
	await updateMessageImagePathByMessagePeoplePromise;
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

router.post("/settings/advanced", async (ctx) => {
	const oldPassword = ctx.request.body.oldPassword;
	const newPassword1 = ctx.request.body.newPassword1;
	const newPassword2 = ctx.request.body.newPassword2;
	const id = ctx.session.user.id;
	const getUserPromise = editUser.getUserById(id);
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
			const resetPasswordPromise = editUser.resetPassword(data);
			await resetPasswordPromise;
			console.log('恭喜你，修改密码成功，请牢记你的新密码！');
			ctx.redirect("/userHome");
		}
	}
});

module.exports = router;
