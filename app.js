const Koa = require('koa');
const path = require('path');
const json = require('koa-json');
const render = require('koa-ejs');
const bodyParser = require('koa-bodyparser');

const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin/admin');
const userDoRouter = require('./routes/user/user_do');
const manageBoardRouter = require('./routes/admin/boards');
const manageTopicRouter = require('./routes/admin/topics');
const userSetRouter = require('./routes/user/user_setting');
const showTopicRouter = require('./routes/topic/show_topics');

const app = new Koa();
const session = require('koa-session');


app.use(json());
app.use(bodyParser());
app.use(require('koa-static')(__dirname));


// 配置模版引擎
render(app, {
    root: path.join(__dirname, 'views'),
    layout: 'layouts/layout',
    viewExt: 'html',
    cache: false,
    debug: false
});


// 配置session
app.keys = ['shygodb'];
const CONFIG = {
    key: 'koa:qibingfang',
    maxAge: 86400000,
    autoCommit: true,
    httpOnly: true,
    overwrite: true,
    signed: true,
    rolling: false,
    renew: false,
};
app.use(session(CONFIG, app));


//配置路由模块
app.use(indexRouter.routes()).use(indexRouter.allowedMethods());
app.use(userDoRouter.routes()).use(userDoRouter.allowedMethods());
app.use(adminRouter.routes()).use(adminRouter.allowedMethods());
app.use(userSetRouter.routes()).use(userSetRouter.allowedMethods());
app.use(showTopicRouter.routes()).use(showTopicRouter.allowedMethods());
app.use(manageBoardRouter.routes()).use(manageBoardRouter.allowedMethods());
app.use(manageTopicRouter.routes()).use(manageTopicRouter.allowedMethods());


//监听端口
app.listen(3000, async() => {
	console.log("Server is running at http://127.0.0.1:3000")
})
