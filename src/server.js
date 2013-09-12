var express = require('express');
var app = express();
var db = require('./database');
var async = require('async');
var SALE_TYPES = ['KULAKAN', 'ECERAN'];

app.use('/static', express.static('public'));
app.use(express.bodyParser());

app.get('/sale/new', function(req, res) {
   db.getItemUnitTypeList(function (err, unitTypes) {
      if (err) {
	     res.send('500', 'Database Error: '+err).message;
	  } else {
	     res.render('sale/new', {'SALE_TYPES': SALE_TYPES, 'unitTypes': unitTypes});
	  }
   });
});

app.post('/sale/saveTransaction', function(req, res) {
   var saleData = req.body;
   // TODO: validate data

   db.saveSaleTransaction(saleData, function (err) {
      var transactionResultStatus = {'success': true};
      
	  if (err) {
	     transactionResultStatus.success = false;
		 transactionResultStatus.errorMessage = err.message;
	  }
	  
	  res.send(transactionResultStatus);
   });
});

app.get('/items/searchByName', function(req, res) {
   var itemName = req.query.itemName;
   if (/^(\w|\d)(\w|\d| )*/.test(itemName)) {
      db.getItemList('%'+itemName+'%', 10, function(err, items) {
	     if (err) {
		    res.send({'items': {}, 'found': false, 'errorMessage': 'Database error: '+err.message});
		 } else {
		    res.send({'items': items, 'found': true});
         }
	  });
   } else {
      res.send({'found': false, 'items': {}, 'errorMessage': 'Item keyword is not valid!'});
   }
});

app.get('/items/getPricePerUnit', function(req, res) {
   var idPattern = /^\d+$/;
   if (SALE_TYPES.indexOf(req.query.saleType) != -1 && idPattern.test(req.query.itemId) && idPattern.test(req.query.unitId)) {
      db.getPricePerUnit(req.query.saleType, req.query.itemId, req.query.unitId, function(err, items) {
	     if (err) {
		    res.send({'pricePerUnit': null, 'found': false, 'errorMessage': 'Database error: '+err.message});
		 } else {
		    if (items.length > 0) {
               res.send({'pricePerUnit': items[0].harga_per_satuan, 'found': true});
			} else {
			   res.send({'pricePerUnit': 0, 'found': true});
			}
         }
	  });
   } else {
      res.send({'pricePerUnit': 0, 'found': false, 'errorMessage': 'Invalid price search parameter!'});
   }
});

app.post('/items/getPriceForItems', function(req, res) {
   var requestJson = req.body;
   var responseJson = {'saleType': requestJson.saleType};
   
   if (SALE_TYPES.indexOf(requestJson.saleType) != -1) {
      var positiveIntegerPattern = /^[1-9]\d*$/;
	  var nonNegativeIntegerPattern = /^\d+$/;
	  var itemPrices = [];
      async.each(
	     requestJson.items,
		 function (item, callback) {
		    var itemPrice = {'itemId': item.itemId, 'unitId': item.unitId, 'rowKey': item.rowKey, 'pricePerUnit': 0};

		    if (positiveIntegerPattern.test(item.itemId) && positiveIntegerPattern.test(item.unitId) && nonNegativeIntegerPattern.test(item.rowKey)) {
			   db.getPricePerUnit(
			      requestJson.saleType, 
				  item.itemId, 
				  item.unitId, 
				  function(err, itemWithPrice) {
					 if (err) {
			            // TODO: handle error
						console.log(err);
					 } else {
					    if (itemWithPrice.length > 0) {
						   itemPrice.pricePerUnit = itemWithPrice[0].harga_per_satuan;
						}
					 }
					 
					 itemPrices.push(itemPrice);
					 callback();
                  }
			   );
			} else {
			   itemPrices.push(itemPrice);
			   callback();
			}
		 },
		 function (err) {
		    if (err) {
			   responseJson.success = false;
			   responseJson.errorMessage = err.message;
			} else {
			   responseJson.success = true;
			}

			responseJson.items = itemPrices;
			res.send(responseJson);
		 }
	  );
   } else {
      responseJson.items = requestJson.items;
	  responseJson.success = false;
	  responseJson.errorMessage = 'Invalid sale type!';
	  res.send(responseJson);
   }
});

app.set('view engine', 'ejs');

app.listen(1612);
console.log('Listening at port 1612');