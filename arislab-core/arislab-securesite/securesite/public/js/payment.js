// function hideAllPaymentMethodContent() {
//     ['payment_qrcode','payment_credit_debit_card', 'payment_cod'].forEach((paymentMethod) => {
//         $(`#${paymentMethod}`).hide();
//     });
// }

// function setPaymentMethod(evt, paymentMethod) {
//     // Declare all variables
//     var i, tabcontent, tablinks;

//     // Get all elements with class="tabcontent" and hide them
//     tabcontent = document.getElementsByClassName("payment_tabContent");
//     for (i = 0; i < tabcontent.length; i++) {
//         tabcontent[i].style.display = "none";
//     }

//     // Get all elements with class="tablinks" and remove the class "active"
//     tablinks = document.getElementsByClassName("payment_tabLink");
//     for (i = 0; i < tablinks.length; i++) {
//         tablinks[i].className = tablinks[i].className.replace(" active", "");
//     }

//     // Show the current tab, and add an "active" class to the button that opened the tab
//     document.getElementById(paymentMethod).style.display = "block";
//     evt.currentTarget.className += " active";
// }

const togglePaymentMethod = () => {
    $('.basket-container').toggleClass('hidden');
    $('.payment-method-container').toggleClass('hidden').toggleClass('flex');
};

const toggleFillAddress = () => {
    $('#addressSection').toggleClass('hidden');
    $('#promptFillAddressSection').toggleClass('hidden');
}

$(document).on('keydown', function(evt) {
    evt = evt || window.event
    var isEscape = false
    if ("key" in evt) {
        isEscape = (evt.key === "Escape" || evt.key === "Esc")
    } else {
        isEscape = (evt.keyCode === 27)
    }
    if (isEscape && $('.payment-method-container').hasClass('hidden') === false) {
        togglePaymentMethod()
    }
});

$(document).on('click', '.btnClosePaymentMethod', function (e) {
    e.preventDefault();
    togglePaymentMethod();
});

$(document).on('click', '#btnPay', function(e) {
    e.preventDefault();
    togglePaymentMethod();
});

$(document).on('click', '.btnPayWithCard', function (e) {
    e.preventDefault();
    togglePaymentMethod();

    if ($('.btnEditDeliveryInfo').length > 0) {

        if ($('.outOfStock').length > 0) {
            // If cart has out of stock item.
            // Notify customer to remove out of stock item.

            $('.outOfStock').each(function (index) {
                $(this).parents('.productRow').addClass('border-red');

                // For scroll to first item that out of stock.
                // if( index == 0 ) {
                //     $([document.documentElement, document.body]).animate({
                //         scrollTop: $(this).offset().top
                //     }, 2000);
                // }
            });
        } else {

            if ($('.productRow').length > 0) {
                $('.basket-container').addClass('hidden');
                $('.loading-container').removeClass('hidden').addClass('flex');

                const VERIFY_CART_INVENTORY = `${HOST}/site/cart/verifyCartInventory?id=${btoa(CART_ID)}`;
                const ENDPOINT_URL = `${HOST}/site/productBooking/new`;
                const REDIRECT_URL = `${HOST}/site/link/paymentRedirect?id=${btoa(CART_ID)}&redirectType=CARD`;

                // Verify cart inventory before booking...
                axios.get(VERIFY_CART_INVENTORY)
                    .then((response) => {
                        if (response.status === 200) {
                            var verifyResult = response.data;
                            // console.log(verifyResult);

                            if (verifyResult.isVerify === true) {
                                $('.loading-container').removeClass('flex').addClass('hidden');
                                $('.redirect-container').removeClass('hidden').addClass('flex');

                                // Booking product.....
                                $('.productRow').each(function (index) {
                                    var selectedProductStringify = $(this).find('.selectedProductStringify').val();
                                    var customerInfoStringify = $('input[name="customerDetailsStringify"]').val();
                                    // console.log('selectedProductStringify ['+index+'] ===> ', selectedProductStringify);
                                    var selectedProduct = JSON.parse(selectedProductStringify);
                                    let customerInfo = JSON.parse(customerInfoStringify);
                                    
                                    var productBooking = {
                                        cartID: CART_ID,
                                        productID: selectedProduct.productID,
                                        hasVariation: selectedProduct.productValue.colorObj.length ? true : false,
                                        variationDetails: {
                                            color: selectedProduct.productValue.colorObj.value,
                                            size: selectedProduct.productValue.size
                                        },
                                        customerInfo: customerInfo,
                                        quantity: selectedProduct.availableQuantity
                                    };

                                    axios.post(ENDPOINT_URL, productBooking, { headers: { 'content-type': 'application/json' } })
                                        .then((response) => {
                                            if (response.status === 200) {
                                                // Book success
                                            } else {
                                                // Book fail
                                            }
                                        });

                                    if (index === $('.productRow').length - 1) {
                                        // Redirect.....
                                        var intervalTime = Math.max(index, 2);
                                        setTimeout(() => { window.location.href = REDIRECT_URL; }, intervalTime * 1000);
                                    }

                                });

                            } else {
                                location.reload(true);
                            }
                        } else {
                            // verify fail
                            location.reload(true);
                        }
                    });

            }

        }
    } else {
        alert("กรุณาใส่ข้อมูลสำหรับจัดส่งสินค้าก่อน");
        toggleFillAddress();
    }
});

$(document).on('click', '.btnPayWithQRCode', function (e) {
    e.preventDefault();
    togglePaymentMethod();

    if ($('.btnEditDeliveryInfo').length > 0) {

        if ($('.outOfStock').length > 0) {
            // If cart has out of stock item.
            // Notify customer to remove out of stock item.

            $('.outOfStock').each(function (index) {
                $(this).parents('.productRow').addClass('border-red');

                // For scroll to first item that out of stock.
                // if( index == 0 ) {
                //     $([document.documentElement, document.body]).animate({
                //         scrollTop: $(this).offset().top
                //     }, 2000);
                // }
            });
        } else {

            if ($('.productRow').length > 0) {
                $('.basket-container').addClass('hidden');
                $('.loading-container').removeClass('hidden').addClass('flex');

                const VERIFY_CART_INVENTORY = `${HOST}/site/cart/verifyCartInventory?id=${btoa(CART_ID)}`;
                const ENDPOINT_URL = `${HOST}/site/productBooking/new`;
                const REDIRECT_URL = `${HOST}/site/link/paymentRedirect?id=${btoa(CART_ID)}&redirectType=QR`;

                // Verify cart inventory before booking...
                axios.get(VERIFY_CART_INVENTORY)
                    .then((response) => {
                        if (response.status === 200) {
                            var verifyResult = response.data;
                            // console.log(verifyResult);

                            if (verifyResult.isVerify === true) {
                                $('.loading-container').removeClass('flex').addClass('hidden');
                                $('.redirect-container').removeClass('hidden').addClass('flex');

                                // Booking product.....
                                $('.productRow').each(function (index) {
                                    var selectedProductStringify = $(this).find('.selectedProductStringify').val();
                                    var customerInfoStringify = $('input[name="customerDetailsStringify"]').val();
                                    // console.log('selectedProductStringify ['+index+'] ===> ', selectedProductStringify);
                                    var selectedProduct = JSON.parse(selectedProductStringify);
                                    let customerInfo = JSON.parse(customerInfoStringify);

                                    var productBooking = {
                                        cartID: CART_ID,
                                        productID: selectedProduct.productID,
                                        hasVariation: selectedProduct.productValue.colorObj.length ? true : false,
                                        variationDetails: {
                                            color: selectedProduct.productValue.colorObj.value,
                                            size: selectedProduct.productValue.size
                                        },
                                        customerInfo: customerInfo,
                                        quantity: selectedProduct.availableQuantity
                                    };

                                    axios.post(ENDPOINT_URL, productBooking, { headers: { 'content-type': 'application/json' } })
                                        .then((response) => {
                                            if (response.status === 200) {
                                                // Book success
                                            } else {
                                                // Book fail
                                            }
                                        });

                                    if (index === $('.productRow').length - 1) {
                                        // Redirect.....
                                        var intervalTime = Math.max(index, 2);
                                        setTimeout(() => { window.location.href = REDIRECT_URL; }, intervalTime * 1000);
                                    }

                                });

                            } else {
                                location.reload(true);
                            }
                        } else {
                            // verify fail
                            location.reload(true);
                        }
                    });

            }

        }
    } else {
        alert("กรุณาใส่ข้อมูลสำหรับจัดส่งสินค้าก่อน");
        toggleFillAddress();
    }
});