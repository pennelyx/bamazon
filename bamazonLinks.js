const Promises = require('bluebird');
const MySQL = require('mysql');

Promises.promisifyAll(require("mysql/lib/Connection").prototype);
Promises.promisifyAll(require("mysql/lib/Pool").prototype);

let bamazonConnection = MySQL.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "5886",
	database: "bamazon"
});

let allConnections = {
	'bamazon' : bamazonConnection
};

module.exports = allConnections;