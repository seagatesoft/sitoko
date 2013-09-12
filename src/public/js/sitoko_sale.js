function SaleDetail(itemId, itemBarcode, itemName, quantity, unitId, pricePerUnit, isCustomPrice) {
   this.itemId = itemId;
   this.itemBarcode = itemBarcode;
   this.itemName = itemName;
   this.quantity = quantity;
   this.unitId = unitId;
   this.pricePerUnit = pricePerUnit;
   this.isCustomPrice = isCustomPrice;
   
   if (typeof SaleDetail._initialized === 'undefined') {
      SaleDetail.prototype.getTotalPrice = function() {
	     return this.quantity * this.pricePerUnit;
	  }
   }
   
   SaleDetail._initialized = true;
}

function Sale(saleDetailsMap, saleId, customerId, customerName, saleType, payment) {
   this.saleDetailsMap = saleDetailsMap;
   this.saleId = saleId;
   this.customerId = customerId;
   this.customerName = customerName;
   this.saleType = saleType;
   this.payment = payment;
   
   if (typeof Sale._initialized === 'undefined') {
      Sale.prototype.getTotalPrice = function() {
	     var totalPrice = 0.00;
		 var saleDetails = this.saleDetailsMap.getValues();
		 var saleDetailsCount = saleDetails.length;
		 for (var index=0;index<saleDetailsCount;index++) {
		    totalPrice += saleDetails[index].getTotalPrice();
		 }
		 
		 return totalPrice;
	  }
   }
   
   Sale._initialized = true;
}
