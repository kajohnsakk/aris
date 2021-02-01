$(document).on("click", ".btn-confirm-reserve-product", function (e) {
  onReserveProductSubmit();
});

// -------------------------------------------------------------------

var openmodal = document.querySelectorAll(".modal-reserve-product-open");
for (var i = 0; i < openmodal.length; i++) {
  openmodal[i].addEventListener("click", function (event) {
    event.preventDefault();
    toggleReserveProductModal();
  });
}

const overlay = document.querySelector(".modal-overlay");
overlay.addEventListener("click", toggleReserveProductModal);

var closemodal = document.querySelectorAll(".modal-reserve-product-close");
for (var i = 0; i < closemodal.length; i++) {
  closemodal[i].addEventListener("click", toggleReserveProductModal);
}

document.onkeydown = function (evt) {
  evt = evt || window.event;
  var isEscape = false;
  if ("key" in evt) {
    isEscape = evt.key === "Escape" || evt.key === "Esc";
  } else {
    isEscape = evt.keyCode === 27;
  }
  if (isEscape && document.body.classList.contains("modal-active")) {
    toggleReserveProductModal();
  }
};

function toggleReserveProductModal() {
  const body = document.querySelector("body");
  const modal = document.querySelector(".reserve-product-modal");
  modal.classList.toggle("opacity-0");
  modal.classList.toggle("pointer-events-none");
  body.classList.toggle("modal-active");
}

function onReserveProductSubmit() {
  $("#loading").css("display", "flex");
  $(".cart-content").hide();

  const APT_URL = `${HOST}/site/reserveProduct`;
  let products = [];

  var customerInfoStr = $('input[name="customerDetailsStringify"]').val();
  var customerInfo = JSON.parse(customerInfoStr);
  var storeID = $("#storeID").val();

  $(".productRow").each(function (index) {
    var selectedProductStr = $(this).find(".selectedProductStringify").val();
    var productInfo = JSON.parse(selectedProductStr);
    products.push(productInfo);
  });

  const productReserve = {
    cartID: CART_ID,
    storeID,
    products,
    customerInfo,
  };

  axios
    .post(APT_URL, productReserve, {
      headers: { "content-type": "application/json" },
    })
    .then((response) => {
      if (response.status === 201) {
        window.location.href = APT_URL + "/status";
      }
    })
    .catch((error) => {
      $("#loading").css("display", "none");
      $(".cart-content").show();
      $(".txt-content").text(error.message).css("color", "#f00");
    });
}
