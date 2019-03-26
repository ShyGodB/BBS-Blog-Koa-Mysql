const mysql = require('mysql2');

const pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '1234qwer',
	database: 'BBS'
});

const promisePool = pool.promise();

const object = {
	async userLogin (email, password) {
		const param = [email, password];
	    const sql = 'select * from user where email=? and password=?';
	    const [rows, fields] = await promisePool.query(sql, param);
    	return rows;
	},

	async getUserByUsername (data) {
		const sql = 'select * from user where username=?';
		const [rows, fields] = await promisePool.query(sql,data[0]);
		if(rows.length !== 0 ) {
			console.log('你输入的用户名已被注册，请重新输入!');
		} else {
			console.log('继续');
			this.getUserByEmail(data);				
		}
	},

	async getUserByEmail (data) {
		const sql = "select * from user where email=?";
		const [rows, fields] = await promisePool.query(sql, data[1]);
		if (rows.length !== 0) {
			console.log('你输入的邮箱已被注册，请重新输入!');
		} else {
			console.log('继续');	
			this.addUserData(data);		
		}
	},

	async addUserData (data) {
		const sql = "insert into user(username, email, password) values(?, ?, ?)";
		const [rows, fields] = await promisePool.query(sql, data);
    	console.log('注册成功');
		console.log('数据存入数据库成功');	
	},

	async getUsernameByEmail (email) {
		const sql = "select * from user where email=?";
		const [rows, fields] = await promisePool.query(sql, email);
		return rows;
	},

	async getUserById (id) {
		const sql = 'select * from user where id=?';
		const [rows, fields] = await promisePool.query(sql, id);
		return rows;
	},

	async addTopicToDatabase (data) {
		const sql = "insert into topic(title, topic_type, article) values(?, ?, ?)";
		const [rows, fields] = await promisePool.query(sql, data);
    	console.log('数据存入数据库成功');
	},

	async listAllTopicFromBBS () {
		const sql = "select * from topic order by id desc";
		const [rows, fields] = await promisePool.query(sql);
		return rows;
	},

	async getTopicFromBBSById (id) {
		const sql = "select * from topic where id=?";
		const [rows, fields] = await promisePool.query(sql, id);
		return rows;
	},

	async addChildBBS (child_bbs) {
		const sql = "insert into child_BBS(child_bbs) values(?)";
		const [rows, fields] = await promisePool.query(sql, child_bbs);
		return rows;
	},

	async listChildBBS () {
		const sql = "select child_bbs from child_BBS";
		const [rows, fields] = await promisePool.query(sql);
		return rows;
	},

	async listChildBBSAll () {
		const sql = "select * from child_BBS";
		const [rows, fields] = await promisePool.query(sql);
		return rows;
	},

	async listTopicByTopicType (topicType) {
		const sql = "select * from topic where topic_type=? ";
		const [rows, fields] = await promisePool.query(sql, topicType);
		return rows;
	},

	async deleteChildBoardById (id) {
		const sql = "delete from child_BBS where id=?";
		const [rows, fields] = await promisePool.query(sql, id);
	},

	async deleteTopicById (id) {
		const sql = "delete from topic where id=?";
		const [rows, fields] = await promisePool.query(sql, id);
	},

	async setStarTopic (id) {
		const sql = "update topic set star=1 where id=?";
		const [rows, fields] = await promisePool.query(sql, id);
	},

	async listStarTopic () {
		const sql = "select * from topic where star=1";
		const [rows, fields] = await promisePool.query(sql);
		return rows;
	},

	async reduceStarTopic (id) {
		const sql = "update topic set star=0 where id=?";
		const [rows, fields] = await promisePool.query(sql, id);
	},

	async listTopTopic () {
		const sql = "select * from topic where top=1";
		const [rows, fields] = await promisePool.query(sql);
		return rows;
	},

	async setTopTopic (id) {
		const sql = "update topic set top=1 where id=?";
		const [rows, fields] = await promisePool.query(sql, id);
	},

	async reduceTopTopic (id) {
		const sql = "update topic set top=0 where id=?";
		const [rows, fields] = await promisePool.query(sql, id);
	}
};

module.exports = object;




