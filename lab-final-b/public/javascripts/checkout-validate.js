$(document).ready(function() {

  // Show/hide card details
  $("input[name='payment']").change(function() {
    if ($("#card").is(":checked")) $("#card-details").removeClass("hidden");
    else $("#card-details").addClass("hidden");
  });

  // Validate on submit and redirect to preview
  $("#checkoutForm").on("submit", function(e) {
    e.preventDefault();
    let valid = true;
    $(".form-control, .form-select, .form-check-input").removeClass("is-invalid is-valid");

    // Helper to mark invalid
    const markInvalid = (id) => { $("#" + id).addClass("is-invalid"); valid = false; };
    const markValid = (id) => { $("#" + id).addClass("is-valid"); };

    // Validation rules
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

    // Scroll to first error
    if (!valid) {
      $('html, body').animate({
        scrollTop: $(".is-invalid:first").offset().top - 100
      }, 500);
      return;
    }

    // Get cart data and totals
    const cart = getCart();
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 200;
    const tax = subtotal * 0.02;

    // Get coupon code if entered
    const couponCode = $("#coupon-code").val() || '';

    // Create form data
    const formData = {
      fullname: name,
      email: email,
      phone: phone,
      address: address,
      city: city,
      postal: postal,
      country: country,
      payment: payment,
      cardholder: $("#cardholder").val() || '',
      cardnum: $("#cardnum").val() || '',
      items: JSON.stringify(cart),
      subtotal: subtotal,
      shipping: shipping,
      tax: tax,
      coupon: couponCode
    };

    // Submit to preview page
    const form = $('<form>', {
      method: 'POST',
      action: '/order/preview'
    });

    // Add all form fields
    Object.keys(formData).forEach(key => {
      form.append($('<input>', {
        type: 'hidden',
        name: key,
        value: formData[key]
      }));
    });

    $('body').append(form);
    form.submit();
  });

  // Real-time correction
  $(".form-control, .form-select, .form-check-input").on("input change", function() {
    if ($(this).hasClass("is-invalid")) $(this).removeClass("is-invalid");
  });
});
