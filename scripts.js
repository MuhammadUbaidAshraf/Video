// <!-- ✅ Bootstrap validation + toggle script -->
(() => {
  'use strict';
  const form = document.querySelector('.needs-validation');
  const cardFields = ['cardholder','cardnum','expiry','cvv'].map(id => document.getElementById(id));
  const cardSection = document.getElementById('card-details');
  const paymentRadios = document.querySelectorAll('input[name="payment"]');

  // Toggle card fields based on payment selection
  paymentRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (document.getElementById('card').checked) {
        cardSection.classList.remove('hidden');
        cardFields.forEach(f => f.required = true);
      } else {
        cardSection.classList.add('hidden');
        cardFields.forEach(f => f.required = false);
      }
    });
  });

  // Bootstrap validation
  form.addEventListener('submit', event => {
    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault(); // stay on page
      document.getElementById('order-success').style.display = 'block';
      window.scrollTo({top: document.getElementById('order-success').offsetTop, behavior: 'smooth'});
    }
    form.classList.add('was-validated');
  }, false);
})();