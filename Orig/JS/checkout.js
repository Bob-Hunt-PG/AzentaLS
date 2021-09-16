'use strict';

setTimeout(function() {
    document.querySelector('input[value="Apply Voucher"]').parentElement.setAttribute('onclick', 'applyVoucherAlert(this); return false;');
}, 1000);

const applyVoucherAlert = (voucher) => {
    let voucherURL = voucher.getAttribute('href');

    Swal.fire({
        title: '<strong>Apply Voucher</u></strong>',
        icon: 'info',
        html:
          '<iframe src="https://brooks.mybrandstorefront.com/' + voucherURL + '"><iframe>',
        showCloseButton: true,
        focusConfirm: false,
        showCancelButton: true,
        showConfirmButton: false,
        confirmButtonText: 'Search',
        preConfirm: false,
    })
}

const closeSwal = () => {
    Swal.close();
}

window.addEventListener("message", function(event) {
    console.log(event.data);
    if(event.data == "closeAlert");{
        closeSwal();
    }
});

function RemoveVoucherAndHideSubmit(intIndex)
{
	if(confirm("Are you sure you want to remove this Voucher?"))
	{
		var objVoucherRow = document.getElementById("voucherrow");
		var objVoucerrs = document.getElementsByName("VoucherIds");
		objVoucherRow.parentNode.deleteRow(intIndex);
		objVoucerrs = document.getElementsByName("VoucherIds");
		
		CalculateTotalWithVouchers();
	}
}