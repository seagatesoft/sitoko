$('#customPrice').on('shown.bs.modal', 
   function() {
      $('#inputCustomPrice').val('').focus();
   }
);

$('#deleteRowWarning').on('shown.bs.modal', 
   function() {
	  $('#confirmDeleteRowButton').focus();
   }
);