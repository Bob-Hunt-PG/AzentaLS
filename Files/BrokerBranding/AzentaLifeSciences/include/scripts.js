$(function() {

    setTimeout(function(){
        /**
         * Voucher Script to set the balance of the voucher being used.
         */
        let balance = $('.pg-c-voucher--table').find('.datatd:nth-of-type(2)').text().replace('$', '');
        $('#Allocate').val(balance);
    }, 500);

	$('#Password').on('blur', function() {
		$(this).closest('table').find('input.btn').focus();
	});

	$('#feedback').on('click', function() {
		sessionStorage.setItem('Feedback', 'Yes');
	});

	if (window.location.href.indexOf("registration.asp") > -1) {
		var feedback = sessionStorage.getItem('Feedback');
		sessionStorage.clear();

		if(feedback === 'Yes') {
			var first_name = $('input[name="FName"]').val(),
				last_name = $('input[name="SName"]').val(),
				email = $('input[name="Email"]').val();

			sessionStorage.setItem('FirstName', first_name);
			sessionStorage.setItem('LastName', last_name);
			sessionStorage.setItem('Email', email);

			window.location.replace('https://azenta.mybrandstorefront.com/page.asp?name=Customer%20Feedback');
		}
	}

	if (window.location.href.indexOf("Customer%20Feedback") > -1) {
		var first_name = sessionStorage.getItem('FirstName'),
			last_name = sessionStorage.getItem('LastName'),
			email = sessionStorage.getItem('Email');

		$('#first_8').val(first_name);
		$('#last_8').val(last_name);
		$('#input_6').val(email);
	}

	if (window.location.href.indexOf("Thank%20You") > -1) {
		sessionStorage.clear();
	}

	if($('#tabDelDetails').length > 0) {
		$('.bordertableheader[colspan="2"]').attr('colspan', '');	
	}

	if (window.location.href.indexOf("ProductCats.asp") > -1) {
		$('.no-records-found').closest('.bootstrap-table').hide();
		$('#btnCartContinue, #btnCart').addClass('btn btn-primary');
		sessionStorage.clear();
	}

	if (window.location.href.indexOf("Step1New.asp") > -1) {
		sessionStorage.clear();

		$('.Azenta.Merchandise').find('#btnSubmit').click();
	}

	if (window.location.href.indexOf("Step1New.asp") > -1 || window.location.href.indexOf("Step5Edit.asp") > -1) {

		$('.product-options').hide();

		$('select[name="CostCentre"]').closest('tr').hide();

		// AZENTA MERCHANDISE TEMPLATES
		if (window.location.href.indexOf("Merchandise") > -1 || $('#Logo').length) {

			$('.product-options').show();

			$('#contenttable').find('h1').first().each(function() {
			    var $this = $(this);
			    $this.html($this.html().replace(/(\S+)\s*$/, '<span class="product-id hide">$1</span>'));
			});

			$('.front-back-title').each(function() {
			    var $this = $(this);
			    $this.html($this.html().replace(/(\S+)\s*$/, '<span class="product-id hide">$1</span>'));
			});

			var product_id = $('.product-id').first().text();
			$('.' + product_id).removeClass('hide');

			var first_color = $('.' + product_id + ' .product-colors').find('.color').first().attr('color');

			if(sessionStorage.getItem('Color') === null) {
				setTimeout(function() {
					$('#Color > option').each(function() {
						var option = $(this).text(),
							color = option.split('-').pop();

						if(first_color === color) {
							$(this).prop('selected', true);
							sessionStorage.setItem('Color', first_color);
						}
					});
				}, 1000);
			}

			$($('#Color > option').get().reverse()).each(function() {
				var color = $(this).text(),
					colorTITLE = color.split('-').pop().replace(/\s*/g, ''),
					colorLOWER = colorTITLE.toLowerCase();

				if(color === '') {

				} else {
					$('#Color').after('<span color="' + colorTITLE + '" class="color ' + colorLOWER + '" onclick="colorSelect(this);" title="' + colorTITLE + '"></span>');
				}
			});

			$('#Logo').closest('table').closest('tr').hide();
			$('#Color').closest('table').closest('tr').hide();

			$( ".spinner" ).spinner({
				icons: { 
					down: "ui-icon-caret-1-s", 
					up: "ui-icon-caret-1-n" 
				},
				min: 0
			});

			setTimeout(function() {
				var column_height = $('.proof-column').outerHeight();
				$('.product-options').css('height', column_height);
			}, 2000);

			$('.spinner').each(function() {
				$(this).on('blur', function() {
					var input = $(this);
					var value = $(this).val();
					var id = $(this).attr('id');
					var price_id = $(this).attr('id') + 'Price';
					var item_price = parseFloat($(this).closest('tr').find('.item-price').text().replace('$', '')).toFixed(2);
					var order_price = parseFloat(item_price * value).toFixed(2);
					var total_pieces = parseFloat($(this).closest('table').find('.total-pieces').text());

					if(value > 0) {
						$(this).closest('tr').addClass('bold');
						sessionStorage.setItem(id, value);
						sessionStorage.setItem(price_id, order_price);
						calcCost(input, value);
					} else if(value <= 0) {
						$(this).closest('tr').removeClass('bold');
						sessionStorage.removeItem(id);
						sessionStorage.removeItem(price_id, order_price);
						calcCost(input, value);
					}

					if($(this).closest('table').find('.total-cost').text() !== '$0.00') {
						$('input[name="btnSubmit"]').removeAttr('disabled');
					} else {
						$('input[name="btnSubmit"]').attr('disabled', 'disabled');
					}
				});
			});


			setTimeout(function() {
				$('.table.proof').find('td').first().attr('align', 'center').addClass('proof-column');
				$('.table.proof').addClass('apparel');
				$('.templatedetails').addClass('apparel');
				$('#btnPreview').hide();
				$('#thumbLP').addClass('apparel');
				$('#spnFrontProof').addClass('apparel');

				$("#thumbLP").elevateZoom({
					tint:true, 
					tintColour:'#000000', 
					tintOpacity:0.5, 
					zoomWindowPosition: 11, 
					scrollZoom : true
				});
				$('#spnFrontProof a.highslide').removeAttr('onclick');
				$('#spnFrontProof a.highslide').removeAttr('href');
			}, 1000);
		}

		// AZENTA REGULAR TEMPLATES
		$('#contactphone1, #contactmobile').on('blur', function() {
			var val = $(this).val();

			if(val.length > 0) {

				if(val.length > 10) {
					var trim = val.substring(0, 10);
					$(this).val(trim);
					$(this).focus();
					return false;
				} else if(val.length < 10) {
					$('.alert-container').addClass('visible');
					$('#alertYN').attr('class', 'visible');
					$(this).focus();
					return false;
				} else if(val.length === 10) {
					var first = val.substring(0, 3),
						second = val.substring(3, 6), 
						third = val.substring(6, 10);

					$(this).val('+1 (' + first + ') ' + second + '.' + third);
				}
			}
		});

		$('#alertYN, .alert-close, .alert-btn-confirm, .alert-btn-abort').on('click', function() {
			$('.alert-container').removeClass('visible');
			setTimeout(closeAlert, 100);
		});

		$('.alert-container').on('click', function() {
			return false;
		});

		$('#contactphone1, #contactmobile').on('focus', function() {
			var val = $(this).val();

			if(val.length > 0) {
				var edited = val.replace('(', '').replace(')', '').replace('.', '').replace(' ', '').replace(' ', '').replace('+1', '');
				$(this).val(edited);
			}
		});
	}

	if (window.location.href.indexOf("Step5Edit.asp") > -1 && $('#Logo').length) {
		
		var ExtraSmall = sessionStorage.getItem('ExtraSmall');
		var Small = sessionStorage.getItem('Small');
		var Medium = sessionStorage.getItem('Medium');
		var Large = sessionStorage.getItem('Large');
		var ExtraLarge = sessionStorage.getItem('ExtraLarge');
		var TwoXLarge = sessionStorage.getItem('2XLarge');
		var ThreeXLarge = sessionStorage.getItem('3XLarge');
		var FourXLarge = sessionStorage.getItem('4XLarge');
		if(sessionStorage.getItem('Comment') !== '') {
			var Comment = sessionStorage.getItem('Comment');
		} else {
			var Comment = '';
		}
		var sizebox;
		var Color = sessionStorage.getItem('Color');
		var product = $('.product-id').first().text();
		$('.' + product + ' table tr').each(function() {
			var input = $(this).find('input');
			var value = $(this).find('input').val();

			if(input.attr('id') === 'ExtraSmall') {
				input.val(ExtraSmall);
				value = input.val();
				var price_id = input.attr('id') + 'Price';
				var item_price = parseFloat(input.closest('tr').find('.item-price').text().replace('$', '')).toFixed(2);
				var order_price = parseFloat(item_price * value).toFixed(2);
				sessionStorage.setItem(price_id, order_price);
				if(parseFloat(value) > 0) {
					$(this).closest('tr').addClass('bold');
				}
			}
			if(input.attr('id') === 'Small') {
				input.val(Small);
				value = input.val();
				var price_id = input.attr('id') + 'Price';
				var item_price = parseFloat(input.closest('tr').find('.item-price').text().replace('$', '')).toFixed(2);
				var order_price = parseFloat(item_price * value).toFixed(2);
				sessionStorage.setItem(price_id, order_price);
				if(parseFloat(value) > 0) {
					$(this).closest('tr').addClass('bold');
				}
			}
			if(input.attr('id') === 'Medium') {
				input.val(Medium);
				value = input.val();
				var price_id = input.attr('id') + 'Price';
				var item_price = parseFloat(input.closest('tr').find('.item-price').text().replace('$', '')).toFixed(2);
				var order_price = parseFloat(item_price * value).toFixed(2);
				sessionStorage.setItem(price_id, order_price);
				if(parseFloat(value) > 0) {
					$(this).closest('tr').addClass('bold');
				}
			}
			if(input.attr('id') === 'Large') {
				input.val(Large);
				value = input.val();
				var price_id = input.attr('id') + 'Price';
				var item_price = parseFloat(input.closest('tr').find('.item-price').text().replace('$', '')).toFixed(2);
				var order_price = parseFloat(item_price * value).toFixed(2);
				sessionStorage.setItem(price_id, order_price);
				if(parseFloat(value) > 0) {
					$(this).closest('tr').addClass('bold');
				}
			}
			if(input.attr('id') === 'ExtraLarge') {
				input.val(ExtraLarge);
				value = input.val();
				var price_id = input.attr('id') + 'Price';
				var item_price = parseFloat(input.closest('tr').find('.item-price').text().replace('$', '')).toFixed(2);
				var order_price = parseFloat(item_price * value).toFixed(2);
				sessionStorage.setItem(price_id, order_price);
				if(parseFloat(value) > 0) {
					$(this).closest('tr').addClass('bold');
				}
			}
			if(input.attr('id') === '2XLarge') {
				input.val(TwoXLarge);
				value = input.val();
				var price_id = input.attr('id') + 'Price';
				var item_price = parseFloat(input.closest('tr').find('.item-price').text().replace('$', '')).toFixed(2);
				var order_price = parseFloat(item_price * value).toFixed(2);
				sessionStorage.setItem(price_id, order_price);
				if(parseFloat(value) > 0) {
					$(this).closest('tr').addClass('bold');
				}
			}
			if(input.attr('id') === '3XLarge') {
				input.val(ThreeXLarge);
				value = input.val();
				var price_id = input.attr('id') + 'Price';
				var item_price = parseFloat(input.closest('tr').find('.item-price').text().replace('$', '')).toFixed(2);
				var order_price = parseFloat(item_price * value).toFixed(2);
				sessionStorage.setItem(price_id, order_price);
				if(parseFloat(value) > 0) {
					$(this).closest('tr').addClass('bold');
				}
			}
			if(input.attr('id') === '4XLarge') {
				input.val(FourXLarge);
				value = input.val();
				var price_id = input.attr('id') + 'Price';
				var item_price = parseFloat(input.closest('tr').find('.item-price').text().replace('$', '')).toFixed(2);
				var order_price = parseFloat(item_price * value).toFixed(2);
				sessionStorage.setItem(price_id, order_price);
				if(parseFloat(value) > 0) {
					$(this).closest('tr').addClass('bold');
				}
			}
			calcCost(input, value);
		});
		$('.' + product + ' #comment.comment').val(Comment);
		$('input[name="btnSubmit"]').removeAttr('disabled');
	}

	if (window.location.href.indexOf("ProofStationery.asp") > -1) {
		$('#divEditDelivery').closest('tr').hide();
	}

	if (window.location.href.indexOf("ProofStationery.asp?BC") > -1) {
		$('.size').each(function() {
			sizebox = $(this).attr('class').split(' ')[1];
	        $(this).closest('tr').find('.DescriptionText').last().find('input').first().attr('class', 'sizequantity ' + sizebox);
	    });

		var ExtraSmall = sessionStorage.getItem('ExtraSmall');
		var Small = sessionStorage.getItem('Small');
		var Medium = sessionStorage.getItem('Medium');
		var Large = sessionStorage.getItem('Large');
		var ExtraLarge = sessionStorage.getItem('ExtraLarge');
		var TwoXLarge = sessionStorage.getItem('2XLarge');
		var ThreeXLarge = sessionStorage.getItem('3XLarge');
		var FourXLarge = sessionStorage.getItem('4XLarge');
		if(sessionStorage.getItem('Comment') !== null) {
			var Comment = sessionStorage.getItem('Comment');
		} else {
			var Comment = '';
		}
		var sizebox;
		var Color = sessionStorage.getItem('Color');

		setTimeout(function() {
			$('.extrasmall').val(ExtraSmall);
			$('.small').val(Small);
			$('.medium').val(Medium);
			$('.large').val(Large);
			$('.extralarge').val(ExtraLarge);
			$('.2xlarge').val(TwoXLarge);
			$('.3xlarge').val(ThreeXLarge);
			$('.4xlarge').val(FourXLarge);
			$('#Comments').val(Comment);

			calculateQuantity(sizebox);
		}, 500);
		

		$('#NJB option[value=' + Color + ']').prop('selected', true);
		$('.selected-color').text(Color);

		$('#divEditDelivery').closest('tr').hide();
		
		$('.sizequantity').each(function() {
			$(this).val('0');
			$(this).on('change', function() {
				calculateQuantity(sizebox);
			});
		});

		$('#BaseCaption, #BaseValues').wrapAll('<div class="selected-color"></div>');
		$('#QuantityCaption, #QuantityValues').wrapAll('<div class="selected-quantity"></div>');

		if($('#NJOptions').length) {
			$('.loading').removeClass('hide');

			setTimeout(function() {
				$('#btnCart').click();
			}, 2500);
		}
	}

	if (window.location.href.indexOf("ProofStationery.asp?bc") > -1) {

		if($('#NJOptions').length) {
			$('.loading').removeClass('hide');
			$('.loading').find('.loading-text h3').first().text('Gathering your product information.');

			$('.size').each(function() {
				sizebox = $(this).attr('class').split(' ')[1];
		        $(this).closest('tr').find('.DescriptionText').last().find('input').first().attr('class', 'sizequantity ' + sizebox);
		    });

		    $('.file').closest('tr').find('.DescriptionText').last().find('input').first().attr('class', 'file file-url');
		    $('.logo-width').closest('tr').find('.DescriptionText').last().find('input').first().attr('class', 'logo logo-width');
		    $('.logo-height').closest('tr').find('.DescriptionText').last().find('input').first().attr('class', 'logo logo-height');

		    $('.sizequantity').each(function() {
				if($(this).val().length <= 0) {
					$(this).val('0');
				}
				$(this).on('change', function() {
					calculateQuantity(sizebox);
				});

				calculateQuantity(sizebox);
			});

		    setTimeout(function() {
		    	var Color = sessionStorage.setItem('Color', $('#NJB').val());

		    	if($('.sizequantity.extrasmall').length) {
					var ExtraSmall = sessionStorage.setItem('ExtraSmall', $('.sizequantity.extrasmall').val());
				}

				if($('.sizequantity.small').length) {
					var Small = sessionStorage.setItem('Small', $('.sizequantity.small').val());
				}

				if($('.sizequantity.medium').length) {
					var Medium = sessionStorage.setItem('Medium', $('.sizequantity.medium').val());
				}

				if($('.sizequantity.large').length) {
					var Large = sessionStorage.setItem('Large', $('.sizequantity.large').val());
				}
				
				if($('.sizequantity.extralarge').length) {
					var ExtraLarge = sessionStorage.setItem('ExtraLarge', $('.sizequantity.extralarge').val());
				}

				if($('.sizequantity.2xlarge').length) {
					var TwoXLarge = sessionStorage.setItem('2XLarge', $('.sizequantity.2xlarge').val());
				}
				
				if($('.sizequantity.3xlarge').length) {
					var ThreeXLarge = sessionStorage.setItem('3XLarge', $('.sizequantity.3xlarge').val());
				}
				if($('.sizequantity.4xlarge').length) {
					var FourXLarge = sessionStorage.setItem('4XLarge', $('.sizequantity.4xlarge').val());
				}
				if($('#Comments').val() !== '') {
					var Comment = sessionStorage.setItem('Comment', $('#Comments').val());
				} else {
					var Comment = sessionStorage.setItem('Comment', '');
				}
		    }, 500);
			
		    $('#divEditDelivery').closest('tr').hide();

			$('#BaseCaption, #BaseValues').wrapAll('<div class="selected-color"></div>');
			$('#QuantityCaption, #QuantityValues').wrapAll('<div class="selected-quantity"></div>');

			setTimeout(function() {
				$('input[value="Edit Artwork Details"]').click();
			}, 2500);
		}
	}

	if (window.location.href.indexOf("cart.asp") > -1 || window.location.href.indexOf("Cart.asp") > -1) {
		$('#tabDelDetails').first('tr').find('.bordertableheader b').text('Delivery Details');
		sessionStorage.clear();

		$(".extraorderfields").each(function() {
			var lines = $(this).html().split("<br>");
			$(this).html('<p>' + lines.join("</p><p>") + '</p>');
		});

		$('.extraorderfields p').each(function() {
			var text = $(this).text(),
				label = $(this).find('b').text(),
				filter = $.trim(text.replace(label, ''));
			if(filter === '0') {
				$(this).remove();
			}

			var label = $(this).find('b').text().replace(':', '');
			$(this).addClass(label);
		});

		$('.Shopping.Cart .table tr').each(function() {
			if($(this).find('.Quantity').length >= 2){
				$(this).find('.Quantity').first().remove();
			}

			if($(this).find('.2X.Large').length >= 2){
				$(this).find('.2X.Large').first().remove();
			}

			if($(this).find('.3X.Large').length >= 2){
				$(this).find('.3X.Large').first().remove();
			}

			if($(this).find('.4X.Large').length >= 2){
				$(this).find('.4X.Large').first().remove();
			}
		});
	}

	if(window.location.href.indexOf("Checkout.asp") > -1) {
		var row = $('table tr td input[value="5"]').parent().parent().clone();
		$('table tr td input[value="5"]').closest('table').append(row);
		$('table tr td input[value="5"]').first().closest('tr').remove();
	}

	if (window.location.href.indexOf("OrderThankYou.asp") > -1 || window.location.href.indexOf("orderthankyou.asp") > -1) {
		var lines = $(".extraorderfields").html().split("<br>");
		$(".extraorderfields").html('<p>' + lines.join("</p><p>") + '</p>');
	}

	if (window.location.href.indexOf("Registration.asp") > -1 || window.location.href.indexOf("orderthankyou.asp") > -1) {
		$('select[name="CostCentre"] option:contains("Basic Access")').prop('selected', true);
		$('select[name="screendef"] option:contains("Azenta Life Sciences")').prop('selected', true);
		$('input[name="DefaultDetails"]').prop('checked', true);
	}
});

function colorSelect(color) {
	var selected = $(color).attr('color');
	$('#Color > option').each(function() {
		var option = $(this).text(),
			color = option.split('-').pop();

		if(selected === color) {
			$(this).prop('selected', true);

			if(selected === 'TrueRoyal') {
				$('#Logo > option:contains(White)').prop('selected', true);
			} else if(selected === 'MidnightNavy') {
				$('#Logo > option:contains(White)').prop('selected', true);
			} else if(selected === 'Navy') {
				$('#Logo > option:contains(White)').prop('selected', true);
			} else if(selected === 'White') {
				$('#Logo > option:contains(Color)').prop('selected', true);
			}
		}
	});

	sessionStorage.setItem('Color', selected);
	RefreshProof();

	$('#btnPreview').hide();
	$('#thumbLP').addClass('apparel');
	$("#thumbLP").elevateZoom({
		tint:true, 
		tintColour:'#000000', 
		tintOpacity:0.5, 
		zoomWindowPosition: 1, 
		scrollZoom : true
	});
	$('#spnFrontProof a.highslide').removeAttr('onclick');
	$('#spnFrontProof a.highslide').removeAttr('href');
}

function calcCost(input, value) {

	var SXNumber = sessionStorage.getItem('ExtraSmall');
	var SNumber = sessionStorage.getItem('Small');
	var MNumber = sessionStorage.getItem('Medium');
	var LNumber = sessionStorage.getItem('Large');
	var ELNumber = sessionStorage.getItem('ExtraLarge');
	var EL2Number = sessionStorage.getItem('2XLarge');
	var EL3Number = sessionStorage.getItem('3XLarge');
	var EL4Number = sessionStorage.getItem('4XLarge');

	if(SXNumber !== null) {
		SXNumber = parseFloat(SXNumber);
	} else {
		SXNumber = 0;
	}

	if(SNumber !== null) {
		SNumber = parseFloat(SNumber);
	} else {
		SNumber = 0;
	}

	if(MNumber !== null) {
		MNumber = parseFloat(MNumber);
	} else {
		MNumber = 0;
	}

	if(LNumber !== null) {
		LNumber = parseFloat(LNumber);
	} else {
		LNumber = 0;
	}

	if(ELNumber !== null) {
		ELNumber = parseFloat(ELNumber);
	} else {
		ELNumber = 0;
	}

	if(EL2Number !== null) {
		EL2Number = parseFloat(EL2Number);
	} else {
		EL2Number = 0;
	}

	if(EL3Number !== null) {
		EL3Number = parseFloat(EL3Number);
	} else {
		EL3Number = 0;
	}

	if(EL4Number !== null) {
		EL4Number = parseFloat(EL4Number);
	} else {
		EL4Number = 0;
	}

	Total = parseFloat(SXNumber) + parseFloat(SNumber) + parseFloat(MNumber) + parseFloat(LNumber) + parseFloat(ELNumber) + parseFloat(EL2Number) + parseFloat(EL3Number) + parseFloat(EL4Number);
	input.closest('table').find('.total-pieces').text(parseFloat(Total));

	if(parseFloat(Total) >= 96) {
		var sum = 0;
		$('.spinner').each(function(){
		    sum += parseFloat(this.value);
		});
		var subtract = sum - 95;
		input.val(value - subtract);

		alert('If you require more than 95 pieces of this style, please call +855.955.PROMO and we would be happy to assist you.');

		var total = 0;
		$('.spinner').each(function(){
		    total += parseFloat(this.value);
		});
		input.closest('table').find('.total-pieces').text(total);

		return false;
	}

	var ExtraSmall = sessionStorage.getItem('ExtraSmallPrice');
	var Small = sessionStorage.getItem('SmallPrice');
	var Medium = sessionStorage.getItem('MediumPrice');
	var Large = sessionStorage.getItem('LargePrice');
	var ExtraLarge = sessionStorage.getItem('ExtraLargePrice');
	var TwoXLarge = sessionStorage.getItem('2XLargePrice');
	var ThreeXLarge = sessionStorage.getItem('3XLargePrice');
	var FourXLarge = sessionStorage.getItem('4XLargePrice');
	var Cost;

	if(ExtraSmall !== null) {
		ExtraSmall = parseFloat(ExtraSmall, 10).toFixed(2);
	} else {
		ExtraSmall = 0;
	}

	if(Small !== null) {
		Small = parseFloat(Small, 10).toFixed(2);
	} else {
		Small = 0;
	}

	if(Medium !== null) {
		Medium = parseFloat(Medium, 10).toFixed(2);
	} else {
		Medium = 0;
	}

	if(Large !== null) {
		Large = parseFloat(Large, 10).toFixed(2);
	} else {
		Large = 0;
	}

	if(ExtraLarge !== null) {
		ExtraLarge = parseFloat(ExtraLarge, 10).toFixed(2);
	} else {
		ExtraLarge = 0;
	}

	if(TwoXLarge !== null) {
		TwoXLarge = parseFloat(TwoXLarge, 10).toFixed(2);
	} else {
		TwoXLarge = 0;
	}

	if(ThreeXLarge !== null) {
		ThreeXLarge = parseFloat(ThreeXLarge, 10).toFixed(2);
	} else {
		ThreeXLarge = 0;
	}

	if(FourXLarge !== null) {
		FourXLarge = parseFloat(FourXLarge, 10).toFixed(2);
	} else {
		FourXLarge = 0;
	}

	Cost = parseFloat(ExtraSmall) + parseFloat(Small) + parseFloat(Medium) + parseFloat(Large) + parseFloat(ExtraLarge) + parseFloat(TwoXLarge) + parseFloat(ThreeXLarge) + parseFloat(FourXLarge);
	input.closest('table').find('.total-cost').text('$' + parseFloat(Cost).toFixed(2));
}

function calculateQuantity(size) {
	var count = 0;
	var sizecount = 0;
	var xxl = $('.sizequantity.2xlarge');
	var xxxl = $('.sizequantity.3xlarge');
	var xxxxl = $('.sizequantity.4xlarge');

	$('.sizequantity').each(function() {
		if(!isNaN(this.value) && this.value.length != 0) {
			count += parseFloat(this.value);
		}
	});

	$('.total-quantity').text(count);
	$('#NJQ option[value=' + count + ']').prop('selected', true).trigger('change');

	var price = $('#NJPriceTag').text();
	$('.total-price').text(price);
}

function closeAlert() {
	$('#alertYN').attr('class', '');
}