var mysql = require('mysql');
var pool = mysql.createPool({
   host: 'localhost',
   user: 'root',
   password: '',
   database: 'sitoko',
   connectionLimit: 5,
   supportBigNumbers: true,
   queueLimit: 5
});

var sendQuery = function(callback, query, variables) {
   pool.getConnection(function (err, connection) {
      if (err) {
	     callback(err);
		 return;
	  } else {
		 connection.query(query, variables, function(err, results) {
		    connection.release();
			
			if (err) {
			   callback(err);
		       return;
			} else {
			   callback(false, results);
			}
		 });
	  }
   });
};

exports.getItemUnitTypeList = function(callback) {
   sendQuery(callback, 'SELECT id, nama FROM item_unit_types');
};

exports.getItemList = function(itemName, limit, callback) {
   if (!limit) {
      limit = 10;
   }

   sendQuery(callback, "SELECT id, barcode, nama FROM items WHERE nama LIKE ? ORDER BY nama LIMIT ?", ['%'+itemName+'%', limit]);
};

exports.getPricePerUnit = function(saleType, itemId, unitId, callback) {
   sendQuery(callback, "SELECT harga_per_satuan FROM item_sale_prices WHERE jenis_penjualan=? AND item_id=? AND item_unit_type_id=?", [saleType, itemId, unitId]);
};

exports.saveSaleTransaction = function(saleData, callback) {
   var async = require('async');
   var dbConnection = null;
   var saleId = null;

   async.series(
      [
	     // get connection
		 function(callback) {
		    pool.getConnection(function (err, connection) {
               if (err) {
	              callback(err);
		          return;
	           } else {
			      dbConnection = connection;
		          callback();
				  return;
	           }
            });
		 },
		 // start transaction
		 function(callback) {
		    dbConnection.query('START TRANSACTION WITH CONSISTENT SNAPSHOT', function(err) {
			   if (err) {
			      callback(err);
			   } else {
			      callback();
			   }
			});
		 },
		 // INSERT INTO HEADER
		 function(callback) {
		    var insertQuery = 'INSERT INTO sales(waktu, jenis_penjualan, harga_total, pembayaran) VALUES(NOW(), ?, ?, ?)';
			var totalPrice = 0;
			
			for (var index=0;index<saleData.items.length;index++) {
			   totalPrice += saleData.items[index].pricePerUnit;
			}

			var values = [saleData.saleType, totalPrice, saleData.payment];
		    dbConnection.query(insertQuery, values, function(err) {
			   if (err) {
			      callback(err);
			   } else {
			      callback();
			   }
			});
		 },
		 // GET SALE ID
		 function(callback) {
		    var lastInsertIdQuery = 'SELECT LAST_INSERT_ID() sale_id FROM DUAL';
		    dbConnection.query(lastInsertIdQuery, function(err, results) {
			   if (err) {
			      callback(err);
			   } else {
			      saleId = results[0].sale_id;
				  callback();
			   }
			});
		 },
		 // INSERT DETAILS
		 function(callback) {
		    async.eachSeries(
			   saleData.items,
			   function(item, eachCallback) {
			      var insertQuery = 'INSERT INTO sale_details(sale_id, item_id, jumlah_barang, item_unit_type_id, harga) VALUES(?, ?, ?, ?, ?);';
			      var values = [saleId, item.itemId, item.quantity, item.unitId, item.pricePerUnit];
		          dbConnection.query(insertQuery, values, function(err, results) {
			         if (err) {
			            eachCallback(err);
			         } else {
				        eachCallback();
			         }
			      });
			   },
			   function (err) {
			      if (err) {
				     callback(err);
				  } else {
				     callback();
				  }
			   }
            );
		 },
		 // COMMIT
		 function(callback) {
		    dbConnection.query('COMMIT', function(err) {
			   if (err) {
			      callback(err);
			   } else {
			      callback(null, saleId);
			   }
			});
		 }
	  ],
	  function(err) {
	     if (dbConnection != null) {
            dbConnection.release();
         }
			
		 if (err) {
			callback(err);
		 } else {
		    callback(null, saleId);
		 }
	  }
   );
};