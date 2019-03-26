const mysql = require('mysql2');

const pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '1234qwer',
	database: 'BBS'
});

const promisePool = pool.promise();

const object = {
	userLogin: async function(email, password) {
		const param = [email, password];
	    const sql = 'select * from user where email=? and password=?';
	    const [rows, fields] = await promisePool.query(sql, param);
    	return rows;
	},
	adminLogin: async function (username, password) {
		const param = [username, password];
		const sql = 'select * from user where username=? and password=?';
		const [rows, fields] = await promisePool.query(sql, param);
		return rows;
	},
	getUserByUsername: async function(data) {
		const sql = 'select * from user where username=?';
		const [rows, fields] = await promisePool.query(sql,data[0]);
		if(rows.length !== 0 ) {
			console.log('你输入的用户名已被注册，请重新输入!');
		} else {
			console.log('继续');
			this.getUserByEmail(data);				
		}
	},
	getUserByEmail: async function(data) {
		const sql = "select * from user where email=?";
		const [rows, fields] = await promisePool.query(sql, data[1]);
		if (rows.length !== 0) {
			console.log('你输入的邮箱已被注册，请重新输入!');
		} else {
			console.log('继续');	
			this.addUserData(data);		
		}
	},
	addUserData: async function(data) {
		const sql = "insert into user(username, email, password) values(?, ?, ?)";
		const [rows, fields] = await promisePool.query(sql, data);
    	console.log('注册成功');
		console.log('数据存入数据库成功');	
	},
	getUsernameByEmail: async function (email) {
		const sql = "select * from user where email=?";
		const [rows, fields] = await promisePool.query(sql, email);
		return rows;
	},
	getUserById: async function (id) {
		const sql = 'select * from user where id=?';
		const [rows, fields] = await promisePool.query(sql, id);
		return rows;
	},
	addTopicToDatabase: async function(data) {
		const sql = "insert into topic(title, topic_type, article) values(?, ?, ?)";
		const [rows, fields] = await promisePool.query(sql, data);
    	console.log('数据存入数据库成功');
	},
	listAllTopicFromBBS: async function() {
		const sql = "select * from topic order by id desc";
		const [rows, fields] = await promisePool.query(sql);
		return rows;
	},
	getTopicFromBBSById: async function(id) {
		const sql = "select * from topic where id=?";
		const [rows, fields] = await promisePool.query(sql, id);
		return rows;
	},
	listTopicFromBBSByTopic_type: async function(topic_type) {
		const sql = "select * from topic where topic_type=?";
		const [rows, fields] = await promisePool.query(sql, topic_type);
		return rows;
	},
	addChildBBS: async function(child_bbs) {
		const sql = "insert into child_BBS(child_bbs) values(?)";
		const [rows, fields] = await promisePool.query(sql, child_bbs);
		return rows;
	},
	listChild_BBS: async function() {
		const sql = "select child_bbs from child_BBS";
		const [rows, fields] = await promisePool.query(sql);
		return rows;
	},
	_listChild_BBS: async function () {
		const sql = "select * from child_BBS";
		const [rows, fields] = await promisePool.query(sql);
		return rows;
	},
	listTopicByTopic_type: async function(topic_type) {
		const sql = "select * from topic where topic_type=? ";
		const [rows, fields] = await promisePool.query(sql, topic_type);
		return rows;
	},
	delete_child_bbs_by_id: async function(id) {
		const sql = "delete from child_BBS where id=?";
		const [rows, fields] = await promisePool.query(sql, id);
	},
	delete_topic_by_id: async function(id) {
		const sql = "delete from topic where id=?";
		const [rows, fields] = await promisePool.query(sql, id);
	},
	setStarTopic: async function(id) {
		const sql = "update topic set star=1 where id=?";
		const [rows, fields] = await promisePool.query(sql, id);
	},
	listStarTopic: async function() {
		const sql = "select * from topic where star=1";
		const [rows, fields] = await promisePool.query(sql);
		return rows;
	},
	reduceStarTopic: async function(id) {
		const sql = "update topic set star=0 where id=?";
		const [rows, fields] = await promisePool.query(sql, id);
	},
	listTopTopic: async function() {
		const sql = "select * from topic where top=1";
		const [rows, fields] = await promisePool.query(sql);
		return rows;
	},
	setTopTopic: async function(id) {
		const sql = "update topic set top=1 where id=?";
		const [rows, fields] = await promisePool.query(sql, id);
	},
	reduceTopTopic: async function(id) {
		const sql = "update topic set top=0 where id=?";
		const [rows, fields] = await promisePool.query(sql, id);
	}
};

module.exports = object;




