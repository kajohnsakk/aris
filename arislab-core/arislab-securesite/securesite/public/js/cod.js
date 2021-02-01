$(document).on('click', '.btnPayWithCod', function (e) {
    e.preventDefault();
    togglePaymentMethod();
    
    if ($('.btnEditDeliveryInfo').length > 0) {

        if ($('.outOfStock').length > 0) {
            // If cart has out of stock item.
            // Notify customer to remove out of stock item.

            $('.outOfStock').each(function (index) {
                $(this).parents('.productRow').addClass('border-red');
            });
        } else {

            if ($('.productRow').length > 0) {
                $('.basket-container').addClass('hidden');
                $('.loading-container').removeClass('hidden').addClass('flex');

                const VERIFY_CART_INVENTORY = `${HOST}/site/cart/verifyCartInventory?id=${btoa(CART_ID)}`;
                const ENDPOINT_URL = `${HOST}/site/productBooking/new`;
                const REDIRECT_URL = `${HOST}/site/link/cashOnDeliveryRedirect?id=${btoa(CART_ID)}`;

                // Verify cart inventory before booking...
                axios.get(VERIFY_CART_INVENTORY)
                    .then((response) => {
                        if (response.status === 200) {
                            var verifyResult = response.data;
                            console.log(verifyResult);

                            if (verifyResult.isVerify === true) {
                                $('.loading-container').removeClass('hidden').addClass('flex');

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
                                            color: selectedProduct.productValue.color,
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
    }
});