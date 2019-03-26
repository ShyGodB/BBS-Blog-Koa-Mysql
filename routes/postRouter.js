const KoaRouter = require('koa-router');
const router = new KoaRouter();
const db = require('../database');

router.post('/', async (ctx) => {
	const username = ctx.request.body.adminName;
	const password = ctx.request.body.adminPassword;
	if (username === 'admin' && password === 'admin') {
		ctx.redirect('/admin');
	} else {
		ctx.body = '登录失败';
	}  
});
router.post('/postTopic', async(ctx) => {
	const title = ctx.request.body.title;
	const topic_type = ctx.request.body.topic_type;
	const article = ctx.request.body.article;
	const data = [title, topic_type, article];
	await db.addTopicToDatabase(data);
	ctx.redirect('/')
});
router.post('/showTopic', async(ctx) => {
	const article = ctx.request.body.article;
	console.log(article);
});
router.post('/createChildBoard', async (ctx) => {
	const child_bbs = ctx.request.body.child_bbs;
	const listChildBBSPromise = db.listChildBBS();
	const listChildBBS = await listChildBBSPromise; //得到的是所有类别子论坛
	let existBBSArray = [];
	listChildBBS.forEach(async (bbs) => {
		existBBSArray.push(bbs.child_bbs);
	});
	if(existBBSArray.length === 0) {
		await db.addChildBBS(child_bbs);
		console.log('创建子论坛成功');
		ctx.redirect('/admin/boardManagement/manageChildBoards');
	} else { 
		if(existBBSArray.indexOf(child_bbs) !== -1) {
			console.log('创建失败，该子论坛已存在，请重新创建!');
			ctx.redirect('/admin/boardManagement/createChildBoard');
		} else {
			db.addChildBBS(child_bbs);
			console.log('创建成功');
			ctx.redirect('/admin/boardManagement/manageChildBoards');
		}
	}
});

module.exports = router;