const KoaRouter = require('koa-router');
const router = new KoaRouter();
const editBoard = require('../lib/boards');
const editTopic = require('../lib/topics');

//  请求主页
router.get("/", async (ctx) => { //路由
	const user = ctx.session.user;
	const allTopicPromise = editTopic.listAllTopic();
	const allTopic = await allTopicPromise;
	const listBoardPromise = editBoard.listBoardAll();
	const listBoard = await listBoardPromise;

	const listStarNotTopTopicPromise = editTopic.listStarNotTopTopic();
	const listStarNotTopTopic = await listStarNotTopTopicPromise;

	const listStarTopicPromise = editTopic.listStarTopic();
	const listStarTopic = await listStarTopicPromise;

	const listTopTopicPromise = editTopic.listTopTopic();
	const listTopTopic = await listTopTopicPromise;

	const listSimpleTopicPromise = editTopic.listSimpleTopic();
	const listSimpleTopic = await listSimpleTopicPromise;

	await ctx.render('index', {
		user: user,
		listBoard: listBoard,
		allTopic: allTopic,
		listStarTopic: listStarTopic,
		listTopTopic: listTopTopic,
		listSimpleTopic, listSimpleTopic,
		listStarNotTopTopic: listStarNotTopTopic
	});
});

router.post("/allTopic/results", async (ctx) => {
	// 需求： 拿到用户在搜索框中输入的字符串，将其与Topic表中所有topic的title进行对比，
	// 有相等的就展示出来，没有则提示用户说：未找到符合条件的内容，搜索的显示页面可以是另外一个页面

	// 拿到用户在搜索框中输入的字符串
	const userInputString = ctx.request.body.user_input_string;

	const listAllTopicFromBBSPromise = editTopic.listAllTopic();
	const allTopic = await listAllTopicFromBBSPromise;

	// 定义一个结果数组，用来存储找到的结果
	let resultArray = [];
	// 将符合条件的添加到results里面
	for(let i = 0; i < allTopic.length; i++) {
		if(allTopic[i].title.indexOf(userInputString) !== -1) {
			resultArray.push(allTopic[i]);
		}
	}
	const user = ctx.session.user;
	await ctx.render("/topics/show_results", {
		user: user,
		resultArray: resultArray,
		userInputString: userInputString
	});

});

module.exports = router;

