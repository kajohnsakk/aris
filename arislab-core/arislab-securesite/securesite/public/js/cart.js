$(document).on('click', '.btnIncreaseQuantity', function (e) {
    const MODE = "INCREASE";
    const ENDPOINT_URL = `${HOST}/site/cart/updateCartItem?cartID=${CART_ID}&mode=${MODE}`;

    let selectedProductStringify = $(this).parents('.productRow').find('.selectedProductStringify').val();

    axios.post(ENDPOINT_URL, selectedProductStringify, { headers: { 'content-type': 'application/json' } })
        .then((response) => {
            if (response.status === 200) {
                // alert('Increase quantity success');
                location.reload(true);
            } else {
                // alert('Failed to increase quantity');
                $(this).attr("disabled", true);
            }
        });
});

$(document).on('click', '.btnDecreaseQuantity', function (e) {
    const MODE = "DECREASE";
    const ENDPOINT_URL = `${HOST}/site/cart/updateCartItem?cartID=${CART_ID}&mode=${MODE}`;

    let selectedProductStringify = $(this).parents('.productRow').find('.selectedProductStringify').val();

    axios.post(ENDPOINT_URL, selectedProductStringify, { headers: { 'content-type': 'application/json' } })
        .then((response) => {
            if (response.status === 200) {
                // alert('Decrease quantity success');
                location.reload(true);
            } else {
                alert('Failed to decrease quantity');
                $(this).attr("disabled", true);
            }
        });
});

$(document).on('click', '.btnRemoveItem', function (e) {
    e.preventDefault();

    const ENDPOINT_URL = `${HOST}/site/cart/removeCartItem?cartID=${CART_ID}`;

    let selectedProductStringify = $(this).parents('.productRow').find('.selectedProductStringify').val();

    axios.post(ENDPOINT_URL, selectedProductStringify, { headers: { 'content-type': 'application/json' } })
        .then((response) => {
            if (response.status === 200) {
                // alert('Remove cart item success');
                location.reload(true);
            } else {
                // alert('Failed to remove cart item');
                $(this).attr("disabled", true);
            }
        });
});

$(document).on('click', '.btnEditDeliveryInfo', function (e) {
    e.preventDefault();

    const REDIRECT_URL = `${HOST}/site/cart/delivery?cartID=${CART_ID}`;

    window.location.replace(REDIRECT_URL);
});

$(document).ready(function (e) {
    if ($('.quantity').text() === "0") {
        $('.btnDecreaseQuantity').attr("disabled", true);
    }
})