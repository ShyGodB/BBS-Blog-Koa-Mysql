const KoaRouter = require('koa-router');
const router = new KoaRouter();
const editBoard = require('../lib/boards');


// 子论坛操作

// 管理子论坛
router.get("/admin/manageBoards", async (ctx) => {  //路由
	const path = ctx.params.path;
	const listBoardPromise = editBoard.listChildBBSAll();
	const listBoard = await listBoardPromise;
	await ctx.render("/admin/manageBoards", {
		layout: 'layouts/layout_admin',
		path: path,
		listBoard: listBoard
	});
});

// 创建子论坛 ---- post
router.post('/admin/manageBoards', async (ctx) => {
	const newBoardName = ctx.request.body.newBoardName;
	const listBoardsPromise = editBoard.listChildBBS();
	const listBoard = await listBoardsPromise; //得到的是所有类别子论坛
	let existBoardArray = [];
	listBoard.forEach(async (board) => {
		existBoardArray.push(board.board_name);
	});
	if(existBoardArray.length === 0) {
		await editBoard.addChildBBS(newBoardName);
		console.log('创建子论坛成功');
		ctx.redirect('/admin/manageBoards');
	} else {
		if(existBoardArray.indexOf(newBoardName) !== -1) {
			console.log('创建失败，该子论坛已存在，请重新创建!');
			ctx.redirect('/admin/manageBoards');
		} else {
			editBoard.addChildBBS(newBoardName);
			console.log('创建成功');
			ctx.redirect('/admin/manageBoards');
		}
	}
});

// 删除子论坛
router.get("/admin/manageBoards/delete/:id", async (ctx) => {
	const id = ctx.params.id;
	const deletePromise = editBoard.deleteChildBoardById(id);
	await deletePromise;
	ctx.redirect("/admin/manageBoards");
});

// 子论坛重命名
router.post("/admin/manageBoards/:id", async (ctx) => {
	const newName = ctx.request.body.newName;
	const id = ctx.params.id;
	console.log(id)
	const data = [newName, id];
	const renamePromise = editBoard.renameBoardById(data);
	await renamePromise;
	ctx.redirect("/admin/manageBoards");
});




module.exports = router;
