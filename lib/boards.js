const mysql = require('mysql2');

const pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '1234qwer',
	database: 'BBS'
});

const promisePool = pool.promise();

const object = {

	async addBoard (boardName) {
		const sql = "insert into boards(board_name) values(?)";
		const [rows, fields] = await promisePool.query(sql, boardName);
		return rows;
	},

	async listBoardAll () {
		const sql = "select * from boards where useful=1";
		const [rows, fields] = await promisePool.query(sql);
		return rows;
	},

	async deleteBoard (id) {
		const sql = "update boards set useful=0 where id=?";
		const [rows, fields] = await promisePool.query(sql, id);
	},

	async outBoard (id) {
		const sql = "update boards set useful=1 where id=?";
		const [rows, fields] = await promisePool.query(sql, id);
	},

	async renameBoard (data) {
		const sql = "update boards set board_name=? where id=?";
		const [rows, fields] = await promisePool.query(sql, data);
	},

	async getBoard (data) {
		const sql = "select * from boards where id=?";
		const [rows, fields] = await promisePool.query(sql, data);
		return rows;
	},

	async listDelBoard () {
		const sql = "select * from boards where useful=0";
		const [rows, fields] = await promisePool.query(sql);
		return rows;
	},

	async listAllBoard () {
		const sql = "select * from boards";
		const [rows, fields] = await promisePool.query(sql);
		return rows;
	}

};

module.exports = object;




