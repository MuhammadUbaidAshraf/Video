$(document).ready(function() {

  $("input[name='payment']").change(function() {
    if ($("#card").is(":checked")) $("#card-details").removeClass("hidden");
    else $("#card-details").addClass("hidden");
  });

  $("#checkoutForm").on("submit", function(e) {
    e.preventDefault();
    let valid = true;
    $(".form-control, .form-select, .form-check-input").removeClass("is-invalid is-valid");

    const markInvalid = (id) => { $("#" + id).addClass("is-invalid"); valid = false; };
    const markValid = (id) => { $("#" + id).addClass("is-valid"); };

    const name = $("#fullname").val().trim();
    if (name.length < 3) markInvalid("fullname"); else markValid("fullname");

    const email = $("#email").val().trim();
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(email)) markInvalid("email"); else markValid("email");

    const phone = $("#phone").val().trim();
    if (!/^\d{10,}$/.test(phone)) markInvalid("phone"); else markValid("phone");

    const address = $("#address").val().trim();
    if (address === "") markInvalid("address"); else markValid("address");

    const city = $("#city").val().trim();
    if (city === "") markInvalid("city"); else markValid("city");

    const postal = $("#postal").val().trim();
    if (!/^\d{4,6}$/.test(postal)) markInvalid("postal"); else markValid("postal");

    const country = $("#country").val();
    if (country === "") markInvalid("country"); else markValid("country");

    const payment = $("input[name='payment']:checked").val();
    if (!payment) { $("input[name='payment']").addClass("is-invalid"); valid = false; }
    else $("input[name='payment']").removeClass("is-invalid");

    if (payment === "card") {
      const cardholder = $("#cardholder").val().trim();
      const cardnum = $("#cardnum").val().trim();
      const expiry = $("#expiry").val().trim();
      const cvv = $("#cvv").val().trim();
      if (cardholder === "") markInvalid("cardholder"); else markValid("cardholder");
      if (cardnum === "") markInvalid("cardnum"); else markValid("cardnum");
      if (expiry === "") markInvalid("expiry"); else markValid("expiry");
      if (cvv === "") markInvalid("cvv"); else markValid("cvv");
    }

    if (!$("#terms").is(":checked")) markInvalid("terms"); else markValid("terms");

    if (!valid) {
      $('html, body').animate({
        scrollTop: $(".is-invalid:first").offset().top - 100
      }, 500);
      return;
    }

    $("button[type='submit']").prop('disabled', true).html('Processing...');

    const cart = getCart();
    if (cart.length === 0) {
      alert('Your cart is empty! Please add items before checkout.');
      $("button[type='submit']").prop('disabled', false).html('Place Order');
      return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 200 : 0;
    const tax = subtotal * 0.02;

    const customer = {
      fullname: name,
      email: email,
      phone: phone,
      address: address,
      city: city,
      postal: postal,
      country: country
    };

    const paymentData = {
      method: payment
    };

    if (payment === "card") {
      paymentData.cardDetails = {
        cardholder: $("#cardholder").val().trim(),
        cardnum: $("#cardnum").val().trim()
      };
    }

    const couponCode = $("#coupon-code").val().trim();

    const form = $('<form>', {
      method: 'POST',
      action: '/order/preview'
    });

    form.append($('<input>', { type: 'hidden', name: 'cart', value: JSON.stringify(cart) }));
    form.append($('<input>', { type: 'hidden', name: 'customer', value: JSON.stringify(customer) }));
    form.append($('<input>', { type: 'hidden', name: 'payment', value: JSON.stringify(paymentData) }));
    form.append($('<input>', { type: 'hidden', name: 'subtotal', value: subtotal.toFixed(2) }));
    form.append($('<input>', { type: 'hidden', name: 'shipping', value: shipping.toFixed(2) }));
    form.append($('<input>', { type: 'hidden', name: 'tax', value: tax.toFixed(2) }));
    form.append($('<input>', { type: 'hidden', name: 'couponCode', value: couponCode }));

    $('body').append(form);
    form.submit();
  });

  $(".form-control, .form-select, .form-check-input").on("input change", function() {
    if ($(this).hasClass("is-invalid")) $(this).removeClass("is-invalid");
  });
});
