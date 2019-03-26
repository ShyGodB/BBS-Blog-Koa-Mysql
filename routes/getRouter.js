const KoaRouter = require('koa-router');
const router = new KoaRouter();
const db = require('../database');

//  请求主页
router.get("/", async (ctx) => { //路由
    const personPromise = db.getUserById(1);
    const person = await personPromise;
    const allTopicPromise = db.listAllTopicFromBBS();
    const allTopic = await allTopicPromise;
    const child_BBSPromise = db.listChild_BBS();
    const child_BBS = await child_BBSPromise;
    await ctx.render('index', {
        user: ctx.session.user,
        child_BBS: child_BBS,
        allTopic: allTopic,
        person: person
    });
});

//  用户主页
router.get("/user_home", async (ctx) => { //路由
    await ctx.render('/user_home', {
        layout: "layout_user_settings",
        user: ctx.session.user
    });
});


//  用户设置
router.get("/settings/profile", async (ctx) => { //路由
    const path = ctx.params.path;
    await ctx.render('/profile', {
        layout: "layouts/layout_user_settings",
        path: path,
        user: ctx.session.user
    });
});
router.get("/settings/connection", async (ctx) => { //路由
    const path = ctx.params.path;
    await ctx.render('/connection', {
        layout: "layouts/layout_user_settings",
        path: path,
        user: ctx.session.user
    });
});
router.get("/settings/advanced", async (ctx) => { //路由
    const path = ctx.params.path;
    await ctx.render('/advanced', {
        layout: "layouts/layout_user_settings",
        path: path,
        user: ctx.session.user
    });
});



//  管理员用户登录
router.get("/admin", async (ctx) => {  //路由 
    const path = ctx.params.path;   
    const list_child_bbs_promise = db._listChild_BBS();
    const list_child_bbs = await list_child_bbs_promise;     
    await ctx.render("/admin", {
        layout: 'layouts/layout_admin',
        path: path,
        list_child_bbs: list_child_bbs
    });
});
router.get("/admin/board_management/show_child_boards", async (ctx) => {  //路由
    const list_child_bbs_promise = db._listChild_BBS();
    const list_child_bbs = await list_child_bbs_promise;
    await ctx.render("/show_child_boards", {
        layout: 'layouts/layout_admin',
        list_child_bbs: list_child_bbs
    });
});
router.get("/admin/board_management/create_child_board", async (ctx) => {  //路由
    const path = ctx.params.path;
    const list_child_bbs_promise = db._listChild_BBS();
    const list_child_bbs = await list_child_bbs_promise;
    await ctx.render("/create_child_board", {
        layout: 'layouts/layout_admin',
        path: path,
        list_child_bbs: list_child_bbs
    });
});
router.get("/admin/board_management/manage_child_boards", async (ctx) => {  //路由
    const path = ctx.params.path;
    const list_child_bbs_promise = db._listChild_BBS();
    const list_child_bbs = await list_child_bbs_promise;
    await ctx.render("/manage_child_boards", {
        layout: 'layouts/layout_admin',
        path: path,
        list_child_bbs: list_child_bbs
    });
});

// 删除子论坛--管理员
router.get("/admin/board_management/manage_child_boards/:id", async (ctx) => {
    const id = ctx.params.id;
    const deletePromise = db.delete_child_bbs_by_id(id);
    await deletePromise;
    ctx.redirect("/admin/board_management/show_child_boards");
});

//  删除帖子
router.get("/admin/allTopicManagement/manageTopics/all/:id", async (ctx) => {
    const id = ctx.params.id;
    const deleteTopicPromise = db.delete_topic_by_id(id);
    await deleteTopicPromise;
    ctx.redirect("/admin/allTopicManagement/manageTopics/all");
});
//  设置精华帖子
router.get("/admin/allTopicManagement/all/:id", async (ctx) => {
    const id = ctx.params.id;
    const setStarPromise = db.setStarTopic(id);
    await setStarPromise;
    ctx.redirect("/admin/allTopicManagement/manageTopics/star");
});
//  取消精华帖子
router.get("/admin/allTopicManagement/star/:id", async (ctx) => {
    const id = ctx.params.id;
    const reduceStarPromise = db.reduceStarTopic(id);
    await reduceStarPromise;
    ctx.redirect("/admin/allTopicManagement/manageTopics/star");
});



//   发表话题
router.get("/postTopic", async (ctx) => {  //路由           
    await ctx.render("/postTopic", {
        user: ctx.session.user
    });
});

//   展示话题
router.get("/showTopics/:topic_type", async (ctx) => {  //路由
    const topic_type = ctx.params.topic_type;
    const personPromise = db.getUserById(1);
    const person = await personPromise;
    const allTopicPromise = db.listAllTopicFromBBS();
    const allTopic = await allTopicPromise;
    const child_BBSPromise = db.listChild_BBS();
    const child_BBS = await child_BBSPromise;
    const listStarTopicPromise = db.listStarTopic();
    const listStarTopic = await listStarTopicPromise;
    const listTopic_byTopic_type_promise = db.listTopicByTopic_type(topic_type);
    const listTopic_byTopic_type = await listTopic_byTopic_type_promise;
    await ctx.render('/showTopics', {
        person: person,
        allTopic: allTopic,
        child_BBS: child_BBS,
        user: ctx.session.user,
        topic_type: topic_type,
        listStarTopic: listStarTopic,
        listTopic_byTopic_type: listTopic_byTopic_type
    });  
});

router.get('/showTopics/all/:id', async (ctx) => {
    const id = ctx.params.id;
    const topicPromise = db.getTopicFromBBSById(id);
    const topic = await topicPromise;
    await ctx.render('/showTopic', {
        user: ctx.session.user,
        topic: topic
    });
});

//帖子管理--管理员
router.get("/admin/allTopicManagement/manageTopics/:topicType", async (ctx) => {  //路由
    const list_child_bbs_promise = db._listChild_BBS();
    const list_child_bbs = await list_child_bbs_promise;
    const child_BBSPromise = db.listChild_BBS();
    const child_BBS = await child_BBSPromise;
    const allTopicPromise = db.listAllTopicFromBBS();
    const allTopic = await allTopicPromise;
    const listStarTopicPromise = db.listStarTopic();
    const listStarTopic = await listStarTopicPromise;
    const topicType = ctx.params.topicType;
    const listTopic_byTopic_type_promise = db.listTopicByTopic_type(topicType);
    const listTopic_byTopic_type = await listTopic_byTopic_type_promise;
    await ctx.render("/manageTopics", {
        layout: 'layouts/layout_admin',
        topicType: topicType,
        child_BBS: child_BBS,
        allTopic: allTopic,
        listStarTopic: listStarTopic,
        listTopic_byTopic_type: listTopic_byTopic_type,
        list_child_bbs: list_child_bbs
    });
});


router.get("/admin/allTopicManagement/:path", async (ctx) => {  //路由
    const path = ctx.params.path;
    const allTopicPromise = db.listAllTopicFromBBS();
    const allTopic = await allTopicPromise;
    const listTopTopicPromise = db.listTopTopic();
    const listTopTopic = await listTopTopicPromise;
    await ctx.render("/manageTopTopics", {
        path: path,
        allTopic: allTopic,
        listTopTopic: listTopTopic,
        layout: 'layouts/layout_admin'
    });
});

//  设置置顶帖子
router.get("/admin/allTopicManagement/manageTopTopics/all/:id", async (ctx) => {
    const id = ctx.params.id;
    const setTopTopicPromise = db.setTopTopic(id);
    await setTopTopicPromise;
    ctx.redirect("/admin/allTopicManagement/top");
});
//  取消置顶帖子
router.get("/admin/allTopicManagement/manageTopTopics/top/:id", async (ctx) => {
    const id = ctx.params.id;
    const reduceTopTopicPromise = db.reduceTopTopic(id);
    await reduceTopTopicPromise;
    ctx.redirect("/admin/allTopicManagement/top");
});


module.exports = router;