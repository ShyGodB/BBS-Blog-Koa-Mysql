const mysql = require('mysql2');

const pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '1234qwer',
	database: 'BBS'
});

const promisePool = pool.promise();

const object = {

	async addTopicToDatabase (data) {
		const sql = "insert into topic(title, board_name, article, topic_image_path, post_man) values(?, ?, ?, ?, ?)";
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

	async listTopicByTopicType (topicType) {
		const sql = "select * from topic where board_name=? ";
		const [rows, fields] = await promisePool.query(sql, topicType);
		return rows;
	},

	async listTopicByPostMan (username) {
		const sql = "select * from topic where post_man=?";
		const [rows, fields] = await promisePool.query(sql, username);
		return rows;
	},

	async updateTopicImagePathByPostMan (data) {
		const sql = "update topic set topic_image_path=? where post_man=?";
		const [rows, fields] = await promisePool.query(sql, data);
		console.log('更新成功');
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
	},

	async getAllTopicTitle () {
		const sql = "select title from topic";
		const [rows, fields] = await promisePool.query(sql);
		return rows;
	}
};

module.exports = object;




