var Stocks = require('../models/stock.js');
var qs = require('querystring');
var url = require('url');

function stockHandler () {

	this.addStock = function (req, res){
		var newSymbol = req.body.symbol;
		//console.log(newSymbol);
		if(newSymbol!==null && newSymbol!==''){
			var query = Stocks.find({'symbol': newSymbol});
			query.exec(function(err, result){
				if(err)	{throw err;}
				if(result===null || result.length===0){
					var newStock = new Stocks();
					newStock.symbol = newSymbol;
					newStock.save(function (err) {
						if (err) {throw err;}
							res.send('success');
						});
				}
				else{
					res.send("Stock with symbol='" + newSymbol + "' is already existed!");
				}
			});
		}
		
	};

	this.getStock = function (req, res){
		var query = Stocks.find();
		query.exec(function(err, result){
			if(err)	{throw err;}
			if(result===null || result.length===0){
				res.json([]);
			}
			else{
				var symbols = [];
				result.forEach(function(r){
					symbols.push(r.symbol);
				});
				//console.log(symbols);
				res.json(symbols);
			}
			
		});
	};

	this.deleteStock = function (req, res) {
		var symbol = url.parse(req.url, true).query.symbol;
		if(symbol){
			var query = Stocks.remove({'symbol': symbol});
			query.exec(function(err, result){
				if(err)	{throw err;}
				res.redirect('/stock');
			});
		}
		else{
			res.send('request url is not valid.');
		}
	};


}

module.exports = stockHandler;