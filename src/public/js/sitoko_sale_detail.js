// declare global variables
var MONEY = new Money;
var VALIDATOR = new Validator;
var SALE_TYPES = [];
var ajaxLoader = new Image();
ajaxLoader.src = '/static/img/ajax-loader.gif';
var SalePage = new Page;
// declare Data Model
SalePage.sale = new Sale;
SalePage.sale.saleDetailsMap = new Map;
SalePage.unitTypes = new Map;
SalePage.itemNameMap = new Map;
// declare Page state variables
SalePage.lastSaleDetailKey = -1;

// declare Page event handlers
SalePage.updateRowPrice = function(rowKey) {
   var saleDetail = SalePage.sale.saleDetailsMap.get(rowKey);
   $('#pricePerUnit-'+rowKey).text(MONEY.display(saleDetail.pricePerUnit));
   $('#pricePerItemTotal-'+rowKey).text(MONEY.display(saleDetail.getTotalPrice()));
};
SalePage.updateTotalPrice = function() {
   var totalPrice = SalePage.sale.getTotalPrice();
   var exchange = parseFloat($('#payment').val()) - totalPrice;
   $('#totalPrice').text(MONEY.display(totalPrice));
   $('#exchange').text(MONEY.display(exchange));
};
SalePage.updateRowAndTotalPrice = function(rowKey) {
   SalePage.updateRowPrice(rowKey);
   SalePage.updateTotalPrice();
};
SalePage.updateQuantity = function(event) {
   var splitted = $(event.target).attr('id').split('-');
   var rowKey = parseInt(splitted[1]);
   var saleDetail = SalePage.sale.saleDetailsMap.get(rowKey);
   saleDetail.quantity = $(event.target).val();

   SalePage.updateRowAndTotalPrice(rowKey);
};
SalePage.validateQuantity = function(event) {
   var splitted = $(event.target).attr('id').split('-');
   var rowKey = parseInt(splitted[1]);
   var saleDetail = SalePage.sale.saleDetailsMap.get(rowKey);

   if (VALIDATOR.validatePositiveInteger(saleDetail.quantity)) {
	  $('#quantityDanger-'+rowKey).remove();
   } else {
	  if ($('#quantityDanger-'+rowKey).length == 0) {
	     var messageHtml = '<p id="quantityDanger-{rowKey}" class="alert alert-danger">Input jumlah barang pada baris {rowNumber} tidak valid!</p>';
	     var substitute = {'rowKey': rowKey};
	     substitute.rowNumber = SalePage.sale.saleDetailsMap.getKeyIndex(rowKey)+1;
	     $('#errorMessage').append(SalePage.substitute(messageHtml, substitute));
      }
	  $(event.target).addClass('alert alert-danger');
   }
};
SalePage.removeQuantityDanger = function(event) {
   $(event.target).removeClass('alert alert-danger');
}
SalePage.showCustomPriceModal = function(event) {
   $('#customPriceModal').modal('show');
   var rowKey = parseInt($(event.target).val());
   $('#setCustomPriceButton').val(rowKey);
   $('#cancelCustomPriceButton').val(rowKey);
   $('#inputCustomPrice').val(SalePage.sale.saleDetailsMap.get(rowKey).pricePerUnit);
};
SalePage.setCustomPrice = function() {
   var inputCustomPrice = $('#inputCustomPrice').val();
   if (VALIDATOR.validatePositiveNumber(inputCustomPrice)) {
      var rowKey = parseInt($('#setCustomPriceButton').val());
      var saleDetail = SalePage.sale.saleDetailsMap.get(rowKey);
      saleDetail.pricePerUnit = parseFloat(inputCustomPrice);
      saleDetail.isCustomPrice = true;
   
      SalePage.updateRowAndTotalPrice(rowKey);
      $('#customPriceModal').modal('hide');
   } else {
      alert('Input harga per satuan tidak valid!');
	  $('#inputCustomPrice').focus();
   }
};
SalePage.addSaleDetailRow =  function() {
   var substitutes = {};
   substitutes['rowKey'] = ++SalePage.lastSaleDetailKey;
   SalePage.sale.saleDetailsMap.put(substitutes['rowKey'], new SaleDetail(null, '', '', 1, 1, 0, false));
   substitutes['rowNumber'] = SalePage.sale.saleDetailsMap.size();
   var rowHtml = SalePage.substitute($('#saleDetailTemplate').html(), substitutes);
   $('#saleTableBody').append(rowHtml);
   $('#itemName-'+substitutes['rowKey']).autocomplete({
	  minLength: 2,
	  delay: 500,
	  source: function(request, response) {
	     $.ajax('/items/searchByName?itemName='+request.term, {'dataType': 'json'})
		 .done( function(data) {
		       var itemNames = [];
		       if (data.found) {
			      // clear item name lookup table
				  if (!SalePage.itemNameMap.isEmpty()) {
				     SalePage.itemNameMap.clear();
                  }

			      data.items.forEach(function (item) {
				     // fill item name lookup table
					 SalePage.itemNameMap.put(item.nama, item.id);
					 // fill auto complete list
					 itemNames.push(item.nama);
				  });
			   }
			   response(itemNames);
         });
      },
	  change: function(event, ui) {
	     var splitted = $(event.target).attr('id').split('-');
		 var rowKey = parseInt(splitted[1]);
		 var saleDetail = SalePage.sale.saleDetailsMap.get(rowKey);
		 
		 if (ui.item == null) {
		    saleDetail.itemId = null;
			saleDetail.pricePerUnit = 0;
			saleDetail.isCustomPrice = false;
			SalePage.updateRowAndTotalPrice(rowKey);
		 } else {
		    saleDetail.itemId = SalePage.itemNameMap.get(ui.item.value);
			SalePage.getPriceForRow(rowKey);
         }
	  }
   });
   
   // unless initial load set focus to the first row input
   if (substitutes['rowKey'] > 0) {
      $('#itemBarcode-'+substitutes['rowKey']).focus();
   }
};
SalePage.getPriceForRow = function (rowKey) {
   var saleDetail = SalePage.sale.saleDetailsMap.get(rowKey);
   
   if (SALE_TYPES.indexOf(SalePage.sale.saleType) != -1 && VALIDATOR.validatePositiveInteger(saleDetail.itemId) && SalePage.unitTypes.containsKey(saleDetail.unitId)) {
      $.ajax('/items/getPricePerUnit', {
         'data': {'saleType': SalePage.sale.saleType, 'itemId': saleDetail.itemId, 'unitId': saleDetail.unitId},
	     'dataType': 'json'
      })
      .done(function (data) {
         saleDetail.pricePerUnit = data.pricePerUnit;
         saleDetail.isCustomPrice = false;
         SalePage.updateRowAndTotalPrice(rowKey);
      });
	  $('#pricePerUnit-'+rowKey).html('<img src="'+ajaxLoader.src+'" alt="dapatkan harga..." />');
   }
};
SalePage.confirmDeleteSaleDetailRow =  function(event) {
   if (SalePage.sale.saleDetailsMap.size() > 1) {
      $('#deleteRowWarning').modal('show');
	  var rowKey = $(event.target).val();
	  $('#confirmDeleteRowButton').val(rowKey);
	  $('#cancelDeleteRowButton').val(rowKey);
   }
};
SalePage.deleteSaleDetailRow =  function(event) {
   var rowKey = parseInt($(event.target).val());
   SalePage.sale.saleDetailsMap.remove(rowKey);
   
   $('#saleDetail-'+rowKey).slideUp('500', function() {$('#saleDetail-'+rowKey).remove()});
   $('#deleteRowWarning').modal('hide');
   SalePage.updateTotalPrice();
   $('#-'+rowKey).remove();
   
   if (rowKey != SalePage.lastSaleDetailKey) {
      SalePage.restartRowNumbering();
   }
};
SalePage.restartRowNumbering = function() {
   var rowKeys = SalePage.sale.saleDetailsMap.getKeys();
   var rowKeysCount = rowKeys.length;
   
   for (var index=0; index<rowKeysCount; index++) {
      $('#itemNumber-'+rowKeys[index]).text(index+1);
   }
};
SalePage.updateExchange = function(event) {
   var payment = parseFloat($(event.target).val());
   SalePage.sale.payment = payment;
   var exchange = payment - SalePage.sale.getTotalPrice();
   $('#exchange').text(MONEY.display(exchange));
};
SalePage.validatePayment = function(event) {
   var payment = parseFloat($(event.target).val());

   if (isNaN(payment) || !VALIDATOR.validateNonNegativeNumber(payment)) {
	  if ($('#paymentDanger').length == 0) {
	     $('#errorMessage').append('<p id="paymentDanger" class="alert alert-danger">Input pembayaran tidak valid</p>');
      }	  
	  $(event.target).addClass('alert alert-danger');
   } else {
	  $('#paymentDanger').remove();
   }
};
SalePage.removePaymentDanger = function(event) {
   $(event.target).removeClass('alert alert-danger');
};
SalePage.updateSaleType = function(event) {
   SalePage.sale.saleType = $(event.target).val();
   
   if (SalePage.validatePricingParams()) {
      var pricingParams = {'saleType': SalePage.sale.saleType, 'items': []};
	  var saleDetailsKeys = SalePage.sale.saleDetailsMap.getKeys();
	  var saleDetails = SalePage.sale.saleDetailsMap.getValues();
	  
	  for (var index=0;index<saleDetails.length;index++) {
	     pricingParams.items.push({'itemId': saleDetails[index].itemId, 'unitId': saleDetails[index].unitId, 'rowKey': saleDetailsKeys[index]});
	  }

      $.ajax('/items/getPriceForItems', {
	     'type': 'post',
         'data': JSON.stringify(pricingParams),
		 'contentType': 'application/json',
	     'dataType': 'json'
      })
      .done(function (data) {
         for (var index=0;index<data.items.length;index++) {
		    var item = data.items[index];
		    var saleDetail = SalePage.sale.saleDetailsMap.get(item.rowKey);
			saleDetail.pricePerUnit = item.pricePerUnit;
            saleDetail.isCustomPrice = false;
            SalePage.updateRowPrice(item.rowKey);
		 }
		 SalePage.updateTotalPrice();
      });
	  
	  for (var index=0;index<saleDetailsKeys.length;index++) {
	     $('#pricePerUnit-'+saleDetailsKeys[index]).html('<img src="'+ajaxLoader.src+'" alt="dapatkan harga..." />');
	  }
   }
};
SalePage.updateItemName = function(event) {
   var splitted = $(event.target).attr('id').split('-');
   var rowKey = parseInt(splitted[1]);
   var saleDetail = SalePage.sale.saleDetailsMap.get(rowKey);
   saleDetail.itemName = $(event.target).val();
};
SalePage.updateUnitId = function(event) {
   var splitted = $(event.target).attr('id').split('-');
   var rowKey = parseInt(splitted[1]);
   var saleDetail = SalePage.sale.saleDetailsMap.get(rowKey);
   saleDetail.unitId = parseInt($(event.target).val());
   SalePage.getPriceForRow(rowKey);
};
SalePage.validateSaleData = function() {
   var validationResult = {'valid': false};
   if (SALE_TYPES.indexOf(SalePage.sale.saleType) == -1) {
      validationResult.message = 'Jenis Penjualan tidak valid: '+SalePage.sale.saleType;
	  return validationResult;
   }
   
   var saleDetails = SalePage.sale.saleDetailsMap.getValues();
   for (var index=0;index<saleDetails.length; index++) {
      if (!VALIDATOR.validatePositiveInteger(saleDetails[index].itemId)) {
	     validationResult.message = 'Barang pada baris ke-'+(index+1)+' tidak valid!';
	     return validationResult;
	  }
	  if (!VALIDATOR.validatePositiveInteger(saleDetails[index].quantity)) {
	     validationResult.message = 'Jumlah barang pada baris ke-'+(index+1)+' tidak valid: '+saleDetails[index].quantity;
	     return validationResult;
	  }
	  if (!SalePage.unitTypes.containsKey(saleDetails[index].unitId)) {
	     validationResult.message = 'Satuan barang pada baris ke-'+(index+1)+' tidak valid! '+saleDetails[index].unitId;
	     return validationResult;
	  }
	  if (!VALIDATOR.validatePositiveNumber(saleDetails[index].pricePerUnit)) {
	     validationResult.message = 'Harga barang pada baris ke-'+(index+1)+' tidak valid:'+saleDetails[index].pricePerUnit;
	     return validationResult;
	  }
   }
   
   validationResult.valid = true;
   return validationResult;
};
SalePage.validatePricingParams = function() {
   var validationResult = {'valid': false};
   if (SALE_TYPES.indexOf(SalePage.sale.saleType) == -1) {
      validationResult.message = 'Jenis Penjualan tidak valid: '+SalePage.sale.saleType;
	  return validationResult;
   }
   
   var saleDetails = SalePage.sale.saleDetailsMap.getValues();
   for (var index=0;index<saleDetails.length; index++) {
      if (!VALIDATOR.validatePositiveInteger(saleDetails[index].itemId)) {
	     validationResult.message = 'Barang pada baris ke-'+(index+1)+' tidak valid!';
	     return validationResult;
	  }
	  if (!SalePage.unitTypes.containsKey(saleDetails[index].unitId)) {
	     validationResult.message = 'Satuan barang pada baris ke-'+(index+1)+' tidak valid! '+saleDetails[index].unitId;
	     return validationResult;
	  }
   }
   
   validationResult.valid = true;
   return validationResult;
};
SalePage.printReceipt = function() {
   var saleDataValidation = SalePage.validateSaleData();
   if (saleDataValidation.valid) {
      var receiptWindow = window.open('', '', 'left=300, top=200, width=700, height=400, toolbar=no, resizeable=no, menubar=no, location=no');
      receiptWindow.document.open();
	  receiptWindow.document.write('<!DOCTYPE html><html><head><title>SITOKO</title><link href="/static/css/print.css" rel="stylesheet" media="screen"><link href="/static/css/print.css" rel="stylesheet" media="print"></head><body><table><thead>');
   
      var tableHeaderSubstitutes = {'time': SalePage.formatDateTime(new Date())};
      tableHeaderSubstitutes['saleId'] = SalePage.sale.saleId == undefined ? '' : SalePage.sale.saleId;
      tableHeaderSubstitutes['customerName'] = SalePage.sale.customerName == undefined ? $('#customerName').val() : SalePage.sale.customerName;
      var tableHeader = SalePage.substitute($('#tablePrintHeader').html(), tableHeaderSubstitutes);
	  receiptWindow.document.write(tableHeader);
	  receiptWindow.document.write('</thead><tbody>');
	  
	  var tableBody = $('#tablePrintBody').html();
      var rowValues = SalePage.sale.saleDetailsMap.getValues();
      var rowValuesCount = rowValues.length;
   
      for (var index=0; index<rowValuesCount; index++) {
	     var saleDetail = rowValues[index];
         var tableBodySubstitutes = {'rowNumber': (index+1), 'itemId': saleDetail.itemId, 'itemName': saleDetail.itemName, 'quantity': saleDetail.quantity, 'unitName': SalePage.unitTypes.get(saleDetail.unitId), 'pricePerUnit': MONEY.display(saleDetail.pricePerUnit), 'totalPricePerUnit': MONEY.display(saleDetail.getTotalPrice())};
	     receiptWindow.document.write(SalePage.substitute(tableBody, tableBodySubstitutes));
      }
	  
      var totalPrice = SalePage.sale.getTotalPrice();
      var exchange = SalePage.sale.payment-totalPrice;
      var tableFooterSubstitutes = {'totalPrice': MONEY.display(totalPrice)};
      tableFooterSubstitutes['payment'] = SalePage.sale.payment ? MONEY.display(SalePage.sale.payment) : '-';
      tableFooterSubstitutes['exchange'] = isNaN(exchange) ? '-' : MONEY.display(exchange);
      var tableFooter = SalePage.substitute($('#tablePrintFooter').html(), tableFooterSubstitutes);
	  receiptWindow.document.write('</tbody>');
	  receiptWindow.document.write(tableFooter);
	  receiptWindow.document.write('</tfoot></table><button type="button" id="closeButton" class="no-print" onclick="window.close();">Tutup</button></body></html>');
	  receiptWindow.document.close();
      receiptWindow.document.getElementById('closeButton').focus();
      receiptWindow.print();
      //html2canvas(receiptWindow.document.getElementById('receiptTable'), {onrendered: function(canvas) {receiptWindow.document.getElementById('renderedReceipt').appendChild(canvas);}});
   } else {
      alert('Tidak bisa melakukan pencetakan struk karena: \n'+saleDataValidation.message);
   }
};
SalePage.saveTransaction = function() {
   var saleDataValidation = SalePage.validateSaleData();
   
   if (saleDataValidation.valid) {
      var saleData = {'saleType': SalePage.sale.saleType, 'payment': null, 'items': []};
	  
	  if (VALIDATOR.validatePositiveNumber(SalePage.sale.payment)) {
	     saleData.payment = SalePage.sale.payment;
	  }
	  
	  var saleDetails = SalePage.sale.saleDetailsMap.getValues();
	  
	  for (var index=0;index<saleDetails.length;index++) {
	     var item = {'itemId': saleDetails[index].itemId, 'quantity': saleDetails[index].quantity, 'unitId': saleDetails[index].unitId, 'pricePerUnit': saleDetails[index].pricePerUnit, 'isCustomPrice': saleDetails[index].isCustomPrice};
		 saleData.items.push(item);
	  }

      $.ajax('/sale/saveTransaction', {
	     'type': 'post',
         'data': JSON.stringify(saleData),
		 'contentType': 'application/json',
	     'dataType': 'json'
      })
      .done(function (data) {
	     $('#savingLoader').modal('hide');
		 if (data.success) {
		    SalePage.sale.saleId = data.saleId;
		    // disable all input except print button
			$('#newSaleForm').find(':input').prop('disabled', true);
			$('#printReceiptButton').prop('disabled', false);
		    // change save button to new transaction button
			$('#saveSaleButton').prop('disabled', false);
			$('#saveSaleButton').unbind('click');
			$('#saveSaleButton').click(function () {location.href='/sale/new'});
			$('#saveSaleButton').html('Buat Transaksi Baru');
			$('#saveSaleButton').focus();
			alert('Transaksi telah berhasil disimpan.');
		 } else {
		    alert('Transaksi gagal disimpan: \n'+data.errorMessage);
		 }
	  });
	  $('#savingLoader').modal({backdrop: 'static', keyboard: false});
   } else {
      alert('Transaksi tidak bisa disimpan: \n'+saleDataValidation.message);
   }
};

// EVENT BINDINGS
// quantity updated
$(document).on('focus', '.quantityInput', null, SalePage.removeQuantityDanger);
$(document).on('change', '.quantityInput', null, SalePage.updateQuantity);
$(document).on('blur', '.quantityInput', null, SalePage.validateQuantity);
// show custom price modal
$(document).on('click', '.customPriceButton', null, SalePage.showCustomPriceModal);
// set custom price
$('#customPriceForm').submit(SalePage.setCustomPrice);
$('#setCustomPriceButton').click(SalePage.setCustomPrice);
// add row
$('#addRowButton').click(SalePage.addSaleDetailRow);
// confirm delete row
$(document).on('click', '.deleteRowButton', null, SalePage.confirmDeleteSaleDetailRow);
// delete row
$('#confirmDeleteRowButton').click(SalePage.deleteSaleDetailRow);
// payment updated
$('#payment').focus(SalePage.removePaymentDanger);
$('#payment').change(SalePage.updateExchange);
$('#payment').blur(SalePage.validatePayment);
// print button
$('#printReceiptButton').click(SalePage.printReceipt);
// sale type changed
$('#saleType').change(SalePage.updateSaleType);
// item name changed
$(document).on('change', '.itemNameInput', null, SalePage.updateItemName);
// unit id changed
$(document).on('change', '.unitSelect', null, SalePage.updateUnitId);
// save transaction
$('#saveSaleButton').click(SalePage.saveTransaction);

// Boostrap customization
$('#customPriceModal').on('shown.bs.modal', 
   function(event) {
	  $('#inputCustomPrice').focus();
   }
);

$('#customPriceModal').on('hidden.bs.modal', 
   function() {
      var rowKey = parseInt($('#setCustomPriceButton').val());
	  $('#customPriceButton-'+rowKey).focus();
   }
);

$('#deleteRowWarning').on('shown.bs.modal', 
   function() {
	  $('#confirmDeleteRowButton').focus();
   }
);

$('#deleteRowWarning').on('hidden.bs.modal', 
   function() {
      var rowKey = parseInt($('#confirmDeleteRowButton').val());
	  
	  if (SalePage.sale.saleDetailsMap.containsKey(rowKey)) {
	     $('#deleteRowButton-'+rowKey).focus();
	  } else {
	     $('#addRowButton').focus();
	  }
   }
);

// insert initial dynamic element
SalePage.addSaleDetailRow();
$('#customerName').focus();