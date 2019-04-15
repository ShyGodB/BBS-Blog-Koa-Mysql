const mysql = require('mysql2');

const pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '1234qwer',
	database: 'BBS'
});

const promisePool = pool.promise();

const object = {

	async updateMessagePic (data) {
		const sql = "update message set message_picpath=? where message_people=?";
		const [rows, fields] = await promisePool.query(sql, data);
		console.log('更新成功');
	},

	async addMessage (data) {
		const sql = "insert into message(topic_id, message_content, message_people, message_picpath) values(?, ?, ?, ?)";
		const [rows, fields] = await promisePool.query(sql, data);
	},

	async listMessage (topic_id) {
		const sql = "select * from message where topic_id=? order by id desc ";
		const [rows, fields] = await promisePool.query(sql, topic_id);
		return rows;
	},

	async getMsgTopicId (data) {
		const sql = "select topic_id from message where message_content=?";
		const [rows, fields] = await promisePool.query(sql, data);
		return rows;
	},

	async getMsgNum(data) {
		const sql = "select * from message where topic_id=?";
		const [rows, fields] = await promisePool.query(sql, data);
		return rows;
	},

};

module.exports = object;




