/** 
 * Map class
 */
function Map(entries) {
   this._keys = [];
   this._values = [];
  
   if (typeof Map._initialized === 'undefined') {
      Map.prototype.put = function (key, value) {
	     var index = this._keys.indexOf(key);
		 if (-1 == index) {
	        this._keys.push(key);
		    this._values.push(value);
		 } else {
		    this._values[index] = value;
		 }
	  };
	  
	  Map.prototype.get = function (key) {
	     var index = this._keys.indexOf(key);
		 if (-1 == index) {
	        return null;
		 } else {
		    return this._values[index];
		 }
	  };
	  
	  Map.prototype.remove = function(key) {
		 var index = this._keys.indexOf(key);
		 if (-1 < index) {
	        this._keys.splice(index, 1);
			return this._values.splice(index, 1)[0];
		 } else {
		    return null;
		 }
	  };
	  
	  Map.prototype.size = function() {
	     return this._keys.length;
	  };
	  
	  Map.prototype.isEmpty = function() {
	     return 0 == this._keys.length;
	  };
	  
	  Map.prototype.clear = function() {
	     this._keys.splice(0, this._keys.length);
		 this._values.splice(0, this._values.length);
	  };
	  
	  Map.prototype.containsKey = function(key) {
	     return !(-1 == this._keys.indexOf(key));
	  };
	  
	  Map.prototype.containsValue = function(value) {
	     return !(-1 == this._values.indexOf(value));
	  };
	  
	  Map.prototype.toObject = function() {
	     var object = new Object;
		 var mapSize = this._keys.length;
		 for (var index=0; index<mapSize; index++) {
		    object[this._keys[index]] = this._values[index];
		 }
		 
		 return object;
	  };
	  
	  Map.prototype.getKeys = function() {
	     return this._keys;
	  };
	  
	  Map.prototype.getValues = function() {
	     return this._values;
	  };
	  
	  Map.prototype.getKeyIndex = function(key) {
	     return this._keys.indexOf(key);
	  };
   }
   
   Map._initialized = true;
   
   // if there is a parameter passed to the constructor
   if (entries != null && typeof entries === 'object') {
      for (key in entries) {
	     this.put(key, entries[key]);
      }
   }
}

/**
 * Money class
 */
function Money()
{
	this.decimalSeparator = '';
	this.threeDigitSeparator = '.';
	this.precision = 0;

	if (typeof Money._initialized === 'undefined') {
	Money.prototype.addThreeDigitSeparator = function (number)
	{
		var numberLength = number.length;
		
		// jika tidak perlu diberi titik karena digitnya kurang dari 4
		if ( numberLength < 4 )
		{
			return number;
		}
		// jika perlu diberi titik
		else
		{
			// cari banyaknya jumlah titik yang diperlukan
			var numOfDot = Math.floor(numberLength/3);
			
			if ( numberLength % 3 == 0 )
			{
				numOfDot--;
			}

			// tambahkan titik pertama (titik paling kanan)
			var numberMoney = this.threeDigitSeparator + number.substr(numberLength-3, 3);
			
			// tambahkan titik2 selanjutnya
			for (var count = 1; count < numOfDot; count++)
			{
				numberMoney = this.threeDigitSeparator + number.substr(numberLength-(3*(count+1)), 3) + numberMoney;
			}
		
			var head = numberLength%3;

			// jika angka di sebelah kiri dari titik paling kiri ada 3 digit
			if (head == 0)
			{
				numberMoney = number.substr(0, 3) + numberMoney;
			}
			// jika angka di sebelah kiri dari titik paling kiri ada 1 atau 2 digit
			else
			{
				numberMoney = number.substr(0, head) + numberMoney;
			}

			return numberMoney;
		}
	}
	
	/**
	 * Fungsi untuk merepresentasikan nilai bilangan dalam format uang
	 *
	 * @param int $string bilangan riil
	 * @return string $money representasi bilangan dalam format uang
	 */
	Money.prototype.display = function (string, showMinus)
	{
		string = String(string);
		if (!showMinus)
		{
			showMinus = false;
		}

		var money;

		// jika variabel $string empty
		if (string == null || string.length == 0 || string == "0")
		{
			money = '0' + this.decimalSeparator;
			
			for (var counter=0; counter < this.precision; counter++)
			{
				money += '0';
			}

			return money;
		}
		// jika variabel $string tidak empty
		else
		{
			// jika bilangan memiliki digit desimal
			var hasDecimalPattern = /\./;
			if ( hasDecimalPattern.test(string) )
			{
				var decimalDigitsPattern = /\.(\d+)$/;
				var decimal = decimalDigitsPattern.exec(string);
				var numOfDecimalDigit = decimal[1].length;
				// jika nilai desimal pada bilangan panjangnya kurang dari PRESISI maka ditambahkan 0 sejumlah kekurangannya
				if ( numOfDecimalDigit < this.precision )
				{
					for (var counter=numOfDecimalDigit; counter < this.precision; counter++)
					{
						decimal[1] += '0';
					}
				}
				else if( numOfDecimalDigit > this.precision )
				{
					decimal[1] = decimal[1].substr(0, this.precision);
				}

				// jika bilangan memiliki tanda negatif
				var hasNegativeSignPattern = /^-/;
				if ( hasNegativeSignPattern.test(string) )
				{
					var integerDigitsPattern = /^-(\d+)\./;
					var integer = integerDigitsPattern.exec(string);
					
					if ( showMinus )
					{
						return '-' + this.addThreeDigitSeparator(integer[1]) +  this.decimalSeparator + decimal[1];
					}
					else
					{
						return '(' + this.addThreeDigitSeparator(integer[1]) +  this.decimalSeparator + decimal[1] + ')';
					}
				}
				// jika bilangan tidak memiliki tanda negatif
				else
				{
					var integerDigitsPattern = /^(\d+)\./;
					var integer = integerDigitsPattern.exec(string);

					return this.addThreeDigitSeparator(integer[1]) +  this.decimalSeparator + decimal[1];
				}
			}
			// jika bilangan tidak memiliki digit desimal
			else
			{
				money = '';
				// jika bilangan tersebut memiliki tanda negatif
				var hasNegativeSignPattern = /^-/;
				if ( hasNegativeSignPattern.test(string) )
				{
					if ( showMinus )
					{
						money = '-' + this.addThreeDigitSeparator( string.substr(1, string.length-1) ) + this.decimalSeparator;
					}
					else
					{
						money = '(' + this.addThreeDigitSeparator( string.substr(1, string.length-1) ) + this.decimalSeparator;

						for (var counter=0; counter < this.precision; counter++)
						{
							money += '0';
						}

						return money + ')';
					}
				}
				// jika bilangan tersebut tidak memiliki tanda negatif
				else
				{
					money = this.addThreeDigitSeparator( string ) + this.decimalSeparator;
				}

				for (var counter=0; counter < this.precision; counter++)
				{
					money += '0';
				}

				return money;
			}
		}
	}

	/**
	* TO DO: masih perlu dikembangkan karena belum lengkap
	*/
	Money.prototype.parseMoney = function(moneyString)
	{
		var hasThreeDigitSeparatorPattern = /\./;
		
		if ( hasThreeDigitSeparatorPattern.test(moneyString) )
		{
			return parseInt( moneyString.gsub(hasThreeDigitSeparatorPattern, '') );
		}
		else
		{
			return parseInt(moneyString);
		}
	}
	}
	
	Money._initialized = true;
}

/** 
 * Validator class
 */
function Validator() {
   this.positiveNumberPattern = /^[1-9][.0-9]*$/;
   this.positiveIntegerPattern = /^[1-9]\d*$/;
   this.nonNegativeNumberPattern = /^\d[.0-9]*$/;
   this.nonNegativeIntegerPattern = /^\d+$/;

   if (typeof Validator._initialized === 'undefined') {
      Validator.prototype.validateWithPattern = function (input, pattern) {
	     if (input == null) {
		    return false;
		 } else if (pattern.test(input)) {
		    return true;
		 } else {
		    return false;
		 }
	  }
	  Validator.prototype.validatePositiveNumber = function(input) {
	     return this.validateWithPattern(input, this.positiveNumberPattern);
      };
	  Validator.prototype.validatePositiveInteger = function(input) {
	     return this.validateWithPattern(input, this.positiveIntegerPattern);
      };
	  Validator.prototype.validateNonNegativeNumber = function(input) {
	     return this.validateWithPattern(input, this.nonNegativeNumberPattern);
      };
	  Validator.prototype.validateNonNegativeInteger = function(input) {
	     return this.validateWithPattern(input, this.nonNegativeIntegerPattern);
      };
   }
   
   Validator._initialized = true;
}
 
/** 
 * Page class
 */
function Page() {
   if (typeof Page._initialized === 'undefined') {
      Page.prototype.substitute = function(input, substitution) {
	     return input.replace(/{(\w+)}/g, function(match, submatch) { return substitution[submatch];});
      };
   }
   
   Page._initialized = true;
}