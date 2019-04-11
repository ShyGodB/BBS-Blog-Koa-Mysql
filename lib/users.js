const mysql = require('mysql2');

const pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '1234qwer',
	database: 'BBS'
});

const promisePool = pool.promise();

const object = {

	async userLogin (data) {
	    const sql = 'select * from user where email=? and password=?';
	    const [rows, fields] = await promisePool.query(sql, data);
    	return rows;
	},

	async getUserByUsername (username) {
		const sql = 'select * from user where username=?';
		const [rows, fields] = await promisePool.query(sql,username);
		return rows;
	},

	async getUserByEmail (email) {
		const sql = "select * from user where email=?";
		const [rows, fields] = await promisePool.query(sql, email);
		return rows;
	},

	async addUser (data) {
		const sql = "insert into user(username, email, password, register_time, last_login_time) values(?, ?, ?, ?, ?)";
		const [rows, fields] = await promisePool.query(sql, data);
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

	async getUserByUsername (data) {
		const sql = 'select * from user where username=?';
		const [rows, fields] = await promisePool.query(sql, data);
		return rows;
	},

	async setProfile (data) {
		const sql = "update user set nickname=?,birthday=?,gender=?,bio=? where id=?";
		const [rows, fields] = await promisePool.query(sql, data);
	},

	async setConnection (data) {
		const sql = "update user set telephone=?,email=?,qq=?,wechat=? where id=?";
		const [rows, fields] = await promisePool.query(sql, data);
	},

	async resetPassword (data) {
		const sql = "update user set password=? where id=?";
		const [rows, fields] = await promisePool.query(sql, data)
	},

	async resetPicture (data) {
		const sql = "update user set picpath=? where id=?";
		const [rows, fields] = await promisePool.query(sql, data);
	},

	async listAlluser () {
		const sql = "select * from user";
		const [rows, fields] = await promisePool.query(sql);
		return rows;
	},

	async deleteUser (id) {
		const sql = "delete from user where id=?";
		const [rows, fields] = await promisePool.query(sql, id);
	},

	async updateNickname (data) {
		const sql = "update user set nickname=? where id=?";
		const [rows, fields] = await promisePool.query(sql, data);
	},

	async updateGender (data) {
		const sql = "update user set gender=? where id=?";
		const [rows, fields] = await promisePool.query(sql, data);
	},

	async updateBirthday (data) {
		const sql = "update user set birthday=? where id=?";
		const [rows, fields] = await promisePool.query(sql, data);
	},

	async updateEmail (data) {
		const sql = "update user set email=? where id=?";
		const [rows, fields] = await promisePool.query(sql, data);
	},

	async updateTelephone (data) {
		const sql = "update user set telephone=? where id=?";
		const [rows, fields] = await promisePool.query(sql, data);
	},

	async updateQQ (data) {
		const sql = "update user set qq=? where id=?";
		const [rows, fields] = await promisePool.query(sql, data);
	},

	async updateWechat (data) {
		const sql = "update user set wechat=? where id=?";
		const [rows, fields] = await promisePool.query(sql, data);
	},

	async updateBio (data) {
		const sql = "update user set bio=? where id=?";
		const [rows, fields] = await promisePool.query(sql, data);
	},

	async updateLoginTime (data) {
		const sql = "update user set last_login_time=? where id=?";
		const [rows, fields] = await promisePool.query(sql, data);
	},

	async updatePostTime (data) {
		const sql = "update user set last_post_time=? where id=?";
		const [rows, fields] = await promisePool.query(sql, data);
	},

	async updateMsgTime (data) {
		const sql = "update user set last_msg_time=? where id=?";
		const [rows, fields] = await promisePool.query(sql, data);
	},

};

module.exports = object;




