const mysql = require('mysql2');

const pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '1234qwer',
	database: 'BBS'
});

const promisePool = pool.promise();

const object = {

	async checkTable() {
		const sql = "show tables like 'user'";
		const [rows, fields] = await promisePool.query(sql);
		if(rows.length === 0) {
			return  false;
		}
		return true;
	},

    async createTableUser() {
        const sql = `
			create table user(
    			id int primary key not null auto_increment,
    			username varchar(32) not null,
				email varchar(128) not null,
				password varchar(128) not null,
				gender varchar(16) default '保密',
				bio varchar(255) default '这个人很懒，什么都没留下...',
				birthday varchar(32) default '保密',
				telephone varchar(16) default '保密',
				qq varchar(16) default '保密',
				wechat varchar(32) default '保密',
				nickname varchar(20) default '暂未设置',
				picpath varchar(128) default 'public/uploads/default.jpeg',
				register_time varchar(32) default '',
				last_login_time varchar(32) default '此前未登陆',
				last_post_time varchar(32) default '',
				last_msg_time varchar(32) default '',
				login_time varchar(32) default '',
				last_post varchar(128) default '您还没有发表任何帖子',
				last_msg varchar(128) default '您还没有任何留言',
				useful boolean default true
			) default charset=utf8 auto_increment=1;
		`;
        await promisePool.query(sql);
    },

	async createTableBoard() {
        const sql = `
			create table boards(
    			id int primary key not null auto_increment,
    			board_name varchar(20) not null,
				useful boolean default true
			) default charset=utf8 auto_increment=1;
		`;
        await promisePool.query(sql);
    },

	async createTableMessage() {
        const sql = `
			create table message(
    			id int primary key not null auto_increment,
    			topic_id int not null,
				message_content text not null,
				message_people varchar(20) default '',
				message_picpath varchar(128) default ''
			) default charset=utf8 auto_increment=1;
		`;
        await promisePool.query(sql);
    },

	async createTableTopic() {
        const sql = `
			create table topic(
    			id int primary key not null auto_increment,
    			title varchar(32) not null,
				board_id varchar(16) not null,
				article varchar(255) not null,
				star boolean default false,
				top boolean default false,
				topic_image_path varchar(128) default '',
				post_man varchar(32) default '',
				board_name varchar(16) default '',
				useful boolean default true,
				msg_num int default 0
			) default charset=utf8 auto_increment=1;
		`;
        await promisePool.query(sql);
    },

};

module.exports = object;
