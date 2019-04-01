const KoaRouter = require('koa-router');
const router = new KoaRouter();
const editBoard = require('../lib/boards');
const editTopic = require('../lib/topics');

//  请求主页
router.get("/", async (ctx) => { //路由
	const user = ctx.session.user;
	const allTopicPromise = editTopic.listAllTopicFromBBS();
	const allTopic = await allTopicPromise;
	const listBoardPromise = editBoard.listChildBBSAll();
	const listBoard = await listBoardPromise;
	await ctx.render('index', {
		user: user,
		listBoard: listBoard,
		allTopic: allTopic
	});
});



router.post("/allTopic/showSearchResults", async (ctx) => {
	// 需求： 拿到用户在搜索框中输入的字符串，将其与Topic表中所有topic的title进行对比，
	// 有相等的就展示出来，没有则提示用户说：未找到符合条件的内容，搜索的显示页面可以是另外一个页面
	// 拿到用户在搜索框中输入的字符串
	const userInputString = ctx.request.body.user_input_string;
	//console.log(typeof userInputString)
	//const userInputArray = userInputString.split(' ');
	// 拿到数据库中所有topic的title，结果返回的是一个包含多个对象的数组
	const listAllTopicFromBBSPromise = editTopic.listAllTopicFromBBS();
	const allTopic = await listAllTopicFromBBSPromise;
	//console.log(allTopic)
	// 定义一个结果数组，用来存储找到的结果
	let resultsArray = [];
	// 将符合条件的Tina 驾到results里面
	for(let i = 0; i < allTopic.length; i++) {
		if(allTopic[i].title === userInputString) {
			resultsArray.push(allTopic[i]);
		}
	}

	router.get('/allTopic/showSearchResults', async (ctx) => {
		const user = ctx.session.user;
		await ctx.render("/topics/showSearchResults", {
			user: user,
			results: resultsArray
		});
	});

});



module.exports = router;

