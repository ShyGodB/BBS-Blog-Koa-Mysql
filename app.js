const Koa = require('koa');
const json = require('koa-json');
const path = require('path');
const render = require('koa-ejs');
const bodyParser = require('koa-bodyparser');
const app = new Koa();

const getRouter = require('./routes/getRouter');
const postRouter = require('./routes/postRouter');
const signUpRouter = require('./routes/signUpRouter');
const signInRouter = require('./routes/signInRouter');
const session = require('koa-session');


app.use(json());
app.use(bodyParser());

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
app.use(getRouter.routes()).use(getRouter.allowedMethods());
app.use(postRouter.routes()).use(postRouter.allowedMethods());
app.use(signUpRouter.routes()).use(signUpRouter.allowedMethods());
app.use(signInRouter.routes()).use(signInRouter.allowedMethods());

//监听端口
app.listen(3000, async() => {
	console.log("Server is running at http://127.0.0.1:3000")
})
