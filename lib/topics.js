const mysql = require('mysql2');

const pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '1234qwer',
	database: 'BBS'
});

const promisePool = pool.promise();

const object = {

	async addTopic (data) {
		const sql = "insert into topic(title, board_id, article, topic_image_path, post_man, board_name) values(?, ?, ?, ?, ?, ?)";
		const [rows, fields] = await promisePool.query(sql, data);
	},

	async listAllTopic () {
		const sql = "select * from topic where useful=1 order by id desc";
		const [rows, fields] = await promisePool.query(sql);
		return rows;
	},

	async getTopicById (id) {
		const sql = "select * from topic where useful=1 and id=?";
		const [rows, fields] = await promisePool.query(sql, id);
		return rows;
	},

	async listTopic (data) {
		const sql = "select * from topic where useful=1 and board_id=? ";
		const [rows, fields] = await promisePool.query(sql, data);
		return rows;
	},

	async listSimpleTopTopic (data) {
		const sql = "select * from topic where useful=1 and top=1 and board_id=? ";
		const [rows, fields] = await promisePool.query(sql, data);
		return rows;
	},

	async listSimpleNotTopTopic (data) {
		const sql = "select * from topic where useful=1 and top=0 and board_id=? ";
		const [rows, fields] = await promisePool.query(sql, data);
		return rows;
	},

	async updateTopicPic (data) {
		const sql = "update topic set topic_image_path=? where useful=1 and post_man=?";
		const [rows, fields] = await promisePool.query(sql, data);
	},

	async deleteTopicById (id) {
		const sql = "update topic set useful=0 where id=?";
		const [rows, fields] = await promisePool.query(sql, id);
	},

	async deleteCompeteTopic (id) {
		const sql = "delete from topic where id=?";
		const [rows, fields] = await promisePool.query(sql, id);
	},

	async outTopic (id) {
		const sql = "update topic set useful=1 where id=?";
		const [rows, fields] = await promisePool.query(sql, id);
	},

	async setStarTopic (id) {
		const sql = "update topic set star=1 where useful=1 and id=?";
		const [rows, fields] = await promisePool.query(sql, id);
	},

	async listStarNotTopTopic () {
		const sql = "select * from topic where useful=1 and star=1 and top=0 order by id desc";
		const [rows, fields] = await promisePool.query(sql);
		return rows;
	},

	async listStarTopic () {
		const sql = "select * from topic where useful=1 and star=1 order by id desc";
		const [rows, fields] = await promisePool.query(sql);
		return rows;
	},

	async listStarTopTopic () {
		const sql = "select * from topic where useful=1 and star=1 and top=1 order by id desc";
		const [rows, fields] = await promisePool.query(sql);
		return rows;
	},

	async reduceStarTopic (id) {
		const sql = "update topic set star=0 where useful=1 and id=?";
		const [rows, fields] = await promisePool.query(sql, id);
	},

	async listTopTopic () {
		const sql = "select * from topic where useful=1 and top=1 order by id desc";
		const [rows, fields] = await promisePool.query(sql);
		return rows;
	},

	async listDelTopic () {
		const sql = "select * from topic where useful=0";
		const [rows, fields] = await promisePool.query(sql);
		return rows;
	},

	async setTopTopic (id) {
		const sql = "update topic set top=1 where useful=1 and id=?";
		const [rows, fields] = await promisePool.query(sql, id);
	},

	async reduceTopTopic (id) {
		const sql = "update topic set top=0 where useful=1 and id=?";
		const [rows, fields] = await promisePool.query(sql, id);
	},

	async listTopicId (data) {
		const sql = "select id from topic where useful=1 and post_man=?";
		const [rows, fields] = await promisePool.query(sql, data);
		return rows;
	},

	async listSimpleTopic () {
		const sql = "select * from topic where useful=1 and top=0 and star=0 order by id desc";
		const [rows, fields] = await promisePool.query(sql);
		return rows;
	},

	async updateTopicMsgNum (data) {
		const sql = "update topic set msg_num=? where id=?";
		const [rows, fields] = await promisePool.query(sql, data);
	}

};

module.exports = object;




