const Inquirer = require('inquirer');
const bamazonConnection = require('./bamazonLinks.js').bamazon;
require ('console.table');

var startCustomer = function () {
	bamazonConnection.queryAsync("SELECT * FROM products").then(data => {
	console.log("Current Stock:");
	data = data.map (item => {
		return {
			item_id: item.item_id,
			Product: item.product_name,
			Price: item.price_cost_for_customer,
			Stock: item.stock_quantity
		}
	})
	console.table(data);

	Inquirer.prompt([
	{
		name:"id",
		type:"input",
		message: "Enter the ID of the product you would like to buy."
	},
	{
		name:"quantity",
		type:"input",
		message: "Enter a number for how many units you would like to buy."
	}
	]).then( (data) => {
		//console.log(data);
		var idOrdered = data.id;
		var quantityOrdered= parseInt(data.quantity);
		bamazonConnection.queryAsync("SELECT * FROM products WHERE item_id = ?", [idOrdered])
			.then (data => {
				if (data[0].stock_quantity >= quantityOrdered) {
					bamazonConnection.queryAsync("UPDATE products SET stock_quantity = ? WHERE item_id = ?", 
						[data[0].stock_quantity-quantityOrdered, idOrdered]);

					console.log(`Item ordred! Your total cost is ${data[0].price_cost_for_customer * quantityOrdered}.`);
				}
				else
					console.log("Insufficient quantity!")
				startCustomer();
			});
	});
});
};

startCustomer();