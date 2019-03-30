const Koa = require('koa');
const json = require('koa-json');
const path = require('path');
const render = require('koa-ejs');
const bodyParser = require('koa-bodyparser');
const app = new Koa();

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');
const topicRouter = require('./routes/topic');
const session = require('koa-session');


app.use(json());
app.use(bodyParser());
app.use(require('koa-static')(__dirname));


//配置模版引擎
render(app, {
    root: path.join(__dirname, 'views'),
    layout: 'layouts/layout',
    viewExt: 'html',
    cache: false,
    debug: false
});

//配置session
app.keys = ['shygodb'];
const CONFIG = {
    key: 'koa:qibingfang',
    maxAge: 86400000,
    autoCommit: true,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: false,
};
app.use(session(CONFIG, app));

 //配置路由模块
app.use(indexRouter.routes()).use(indexRouter.allowedMethods());
app.use(userRouter.routes()).use(userRouter.allowedMethods());
app.use(adminRouter.routes()).use(adminRouter.allowedMethods());
app.use(topicRouter.routes()).use(topicRouter.allowedMethods());

//监听端口
app.listen(3000, async() => {
	console.log("Server is running at http://127.0.0.1:3000")
})
