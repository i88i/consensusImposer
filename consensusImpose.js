$(document).ready(function() {
    

var maxLength = 1500;
$('#offer1Area').on('change keyup paste mousemove click', function() {
  var length = $(this).val().length;
  var length = maxLength-length;
  $('#chars').text(length);
});

var defaultOffer = "- This sale is between (undisclosed, city) and (undisclosed, city).\n" + "\n" +
"- eMail address of the seller is (seller@example.com), eMail of the buyer is (buyer@example.com)" + "\n" + 
"- The item being sold is a (item for sale). It is located in (city). (enter pertinent description, condition etc.. here) \n" + "\n" + 
"- The agreed price for above item is (US$...) including shipping, to be paid in advance to Bitcoin multisig address #: ........................... \n" +
"- Seller pays for shipping.\n" + "\n" + 
"- Shipping method is USPS Priority Mail\n" + "\n" + 
"- Seller ships within 3 business days after payment to multisig Bitcoin address has occurred.\n" + "\n" + 
"- The agreed Arbitrator (third signatory) for this transaction is Axel Bieringer, email: support@altconsys.com. \n" + "\n" + 
"- Within 24 hours of receipt of the merchandise Buyer will release the funds held in the multisig BTC address by signing with their private key, or, if there is a problem, immediately contact the arbitrator, Axel Bieringer, at support@altconsys.com.\n" + "\n" +
"- In case of a dispute both parties agree to provide the arbitrator within reasonable time with all information supporting their case\n";

var Agreement = "Congratulations. The checksums are matching. Both contract parties are now in agreement. Please save the text of the contract along with the checksum in a safe location. To protect your privacy AltConSys will not save contracts. The checksum will be entered into the blockchain to become part of your multisig transaction.";

$('.phoenix-btc').phoenix({
	webStorage: "localStorage",
    maxItems: 50,
    saveInterval: 3000,
    clearOnSubmit: false,
    saveOnChange: true,
    keyAttributes: ["tagName", "id", "name"]
    }); 

    
$('.phoenix-off').phoenix({
	webStorage: "sessionStorage",
    maxItems: 50,
    saveInterval: 3000,
    clearOnSubmit: false,
    saveOnChange: true,
    keyAttributes: ["tagName", "id", "name"]
    }); 


$("#defaultOffer").click(function(){  
$("#offer1Area").val(defaultOffer);
});

$("#adoptOffer").click(function(){
    $('#offer1Area').val( $('#offer2Area').val() );
});
    
$("#offerErase").click(function(){
    $("#offer1Area").val('');
    $('#signs').text(maxLength + " characters left");  // This resets character counter above
});

// $('#offer1Area').on('change keyup paste mousemove click', function() {
$('#checksum1').on('change keyup paste mousemove click', function() {
    var checksumText = $("#offer1Area").val();
    checksumNoWhite = checksumText.replace(/\s+/g, "").trim();
    $('#checksum1').val(md5(checksumNoWhite));
 });

 $('#contractfields').submit(function(e) {
    e.preventDefault();
    checksumText = $("#offer1Area").val(); // same as above
    checksumNoWhite = checksumText.replace(/\s+/g, "").trim();
 $('#checksum1').val(md5(checksumNoWhite));
    e.stopImmediatePropagation();
  
    offerAjax();
 //    $('#contractfields').unbind('submit');
 });
 

function offerAjax() {
  
	  var offerLoad = [];
      var offer = "";
      
checksumLast = $('#checksum1').val();
checksumFirst = localStorage.getItem("checksumFirst");
checksum2 = $('#checksum2').val();
offerLoad[0] = checksum2;
// Send offer only when changed:
if (checksumLast != checksumFirst) {
  localStorage.setItem('checksumFirst', checksumLast);
  offer = $("#offer1Area").val();
  offerLoad[1] = offer;
}

  doOffAjax(offerLoad);					
 
// else {
//  offerLoad[0] = checksum2;
//  doOffAjax(offerLoad);	
// }
 
 
	function doOffAjax(offerLoad) {
		
		
		var jsn, ajax;
					
	    jsn = JSON.stringify(offerLoad);
  
	
		ajax = theOffAjax(jsn);
		ajax.done(processReturnOffers);
		ajax.fail(function( jqXHR, textStatus, errorThrown) {
				//Output error information
		});
    }
    
function theOffAjax(jsn) { // console.log(jsn);
  	return $.ajax({

      url: 'https://checkabid.com/btc/offers.php',
      beforeSend: function(xhr){
                xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("Token"));
//               console.log(localStorage.getItem("Token"));
            },
 //  contentType: 'application/json',
 //  dataType: 'json',
    processTakeURLData: false,
	 data: jsn,
// data: JSON.stringify(urls),
//    data: { js_array: arr },
	  type: "POST",
	  cache: false,
      error: function(xhr, desc, err) {
    },
	  success: function(msg) {
//   console.log("got it done!");
	  }
    }); // end $.ajax return call
}         // end of theAjax
}   // end of Ajax()
 
	function processReturnOffers(returnedstuff /*}textStatus, jqXHR*/) {

var response = JSON.parse(returnedstuff);
//	console.log("this here is the JSONparsed response:");
// console.log(response);
if (response.noMatch == true) {
  Swal.fire({
  position: 'center',
  type: 'warning',
  title: 'Checksums don\'t match! Please try again and/or talk to your counterparty!',
  showConfirmButton: false,
  timer: 1500
});
$('#newTransaction').removeClass('show').addClass('hidden').fadeOut();
}   
offer2Area = response.data.offerData;
offer2Checksum = response.data.checksumData;
// console.log(offer2Area);
 if (offer2Area)  {$('#offer2Area').val(offer2Area);}
 if (offer2Checksum)  {$('#checksum2').val(offer2Checksum);}


if (($('#checksum2').val()) == ($('#checksum1').val())) {
  Swal.fire({
  type: 'success',
  title: 'CheckSums are a Match! Both contract parties are now in agreement. Please continue below:',
  showConfirmButton: false,
  timer: 1500
});
$('#newTransaction').removeClass('hidden').show();
}        

    }
});
