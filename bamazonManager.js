const Inquirer = require('inquirer');
const bamazonConnection = require('./bamazonLinks.js').bamazon;
require ('console.table');

var viewAll = function (){
	bamazonConnection.queryAsync("SELECT * FROM products").then(data => {
		console.log(" ");
		console.log("Current Stock:");
		data = data.map (item => {
			return {
				item_id: item.item_id,
				Product: item.product_name,
				Price: item.price_cost_for_customer,
				Stock: item.stock_quantity
			}
		});
		console.table(data);
		startManager();
	});
};

var viewLow = function (){
	bamazonConnection.queryAsync("SELECT * FROM products WHERE stock_quantity < ?", [5])
	.then (data =>{
		console.log(" ");
		console.log("Items with Stock Quantity lower than 5:");
		data = data.map (item => {
			return {
				item_id: item.item_id,
				Product: item.product_name,
				Price: item.price_cost_for_customer,
				Stock: item.stock_quantity
			}
		});
		console.table(data);
		startManager();
	});
};

var addQuantity = function (){
	Inquirer.prompt([
	{
		name:"id",
		type:"input",
		message: "Enter the ID of the product you would like to add"
	},
	{
		name:"quantity",
		type:"input",
		message: "How many to add to inventory?"
	}
	]).then( data => {
		//console.log(data.id-data.quantity);
		var idOrdered = data.id;
		var quantityOrdered= parseInt(data.quantity);
		bamazonConnection.queryAsync("SELECT * FROM products WHERE item_id = ?", [idOrdered])
			.then (data => {
				bamazonConnection.queryAsync("UPDATE products SET stock_quantity = ? WHERE item_id = ?", 
					[data[0].stock_quantity+quantityOrdered, idOrdered]);
				console.log(`${quantityOrdered} ${data[0].product_name} were added to inventory`);
				console.log(" ");
			startManager();
		});
	});
};

var addNew = function (){
	Inquirer.prompt([
	{
		name:"product_name",
		type:"input",
		message: "What product you would like to add?"
	},{
		name:"department_name",
		type:"input",
		message: "Which department the product belongs to?"
	},{
		name:"price_cost_for_customer",
		type:"input",
		message: "What is the retail price?"
	},{
		name:"stock_quantity",
		type:"input",
		message: "How many to add to inventory?"
	}
	]).then (data => {
		//console.log(data);
		bamazonConnection.queryAsync("INSERT INTO products SET ?", {
			product_name:data.product_name,
			department_name:data.department_name,
			price_cost_for_customer:data.price_cost_for_customer,
			stock_quantity:data.stock_quantity
		});
		console.log(" ");
		startManager();
	});
};

var startManager = function (){
	Inquirer.prompt([{
		  name: 'op',
		  message: 'What would you like to do?',
		  type: 'list',
		  choices: [
			  {
			  	name: "View Products for Sale",
			  	value : "viewAll"
			  },{
			  	name: "View Low Inventory",
			  	value : "viewLow"
			  },{
			  	name: "Add to Inventory",
			  	value : "addQuantity"
			  },{
			  	name: "Add New Product",
			  	value : "addNew"
			  }]
	}]). then (data => {
		switch (data.op) {
			case "viewAll": viewAll(); 
			break;
			case "viewLow": viewLow(); 
			break;
			case "addQuantity": addQuantity(); 
			break;
			case "addNew": addNew(); 
			break;
			default: console.log("error!");
		}
	});
};

startManager();