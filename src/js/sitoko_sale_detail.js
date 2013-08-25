var MONEY = new Money();
var VALIDATOR = new Validator();
var SalePage = new Page;
// declare Data Model
SalePage.sale = new Sale();
SalePage.sale.saleDetailsMap = new Map();
SalePage.sale.saleDetailsMap.put(0, new SaleDetail(null, '', '', 1, 0, 0, false));
// declare UIModels
// declare Page state variables
SalePage.lastSaleDetailKey = -1;

// declare Page event handlers
SalePage.updateTotalPrice = function() {
   var totalPrice = SalePage.sale.getTotalPrice();
   var payment = parseFloat($('#payment').val());
   var exchange = (isNaN(payment) ? 0 : payment) - totalPrice;
   $('#totalPrice').text(MONEY.display(totalPrice));
   $('#exchange').text(MONEY.display(exchange));
};
SalePage.updateRowAndTotalPrice = function(rowKey) {
   var saleDetail = SalePage.sale.saleDetailsMap.get(rowKey);
   $('#pricePerUnit-'+rowKey).text(MONEY.display(saleDetail.pricePerUnit));
   $('#pricePerItemTotal-'+rowKey).text(MONEY.display(saleDetail.getTotalPrice()));
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
      $('#errorMessage').removeClass('alert alert-danger').text('');
   } else {
      $('#errorMessage').addClass('alert alert-danger').text('Input jumlah barang tidak valid!');
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
   SalePage.sale.saleDetailsMap.put(substitutes['rowKey'], new SaleDetail(null, '', '', 1, 0, 0, false));
   substitutes['rowNumber'] = SalePage.sale.saleDetailsMap.size();
   var rowHtml = SalePage.substitute($('#saleDetailTemplate').html(), substitutes);
   $('#saleTableBody').append(rowHtml);
   
   // unless initial load set focus to the first row input
   if (substitutes['rowKey'] > 0) {
      $('#itemBarcode-'+substitutes['rowKey']).focus();
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
$('#customer-name').focus();