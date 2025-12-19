// Checkout page cart functionality

// Load and display cart items
function loadCartItems() {
  const cart = getCart();
  const cartItemsList = document.getElementById('cart-items-list');
  const emptyCartMessage = document.getElementById('empty-cart-message');
  
  if (!cartItemsList) return;
  
  if (cart.length === 0) {
    if (emptyCartMessage) {
      emptyCartMessage.style.display = 'block';
    }
    cartItemsList.innerHTML = '';
    updateCheckoutTotals();
    return;
  }
  
  if (emptyCartMessage) {
    emptyCartMessage.style.display = 'none';
  }
  
  cartItemsList.innerHTML = '';
  
  cart.forEach(item => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = `
      <div class="d-flex align-items-center gap-2">
        <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart('${item.id}'); loadCartItems();">×</button>
        <span>${item.name}</span>
        <span class="badge bg-secondary">${item.quantity}x</span>
      </div>
      <div class="d-flex align-items-center gap-2">
        <input type="number" min="1" value="${item.quantity}" 
               class="form-control form-control-sm" style="width: 70px;"
               onchange="updateQuantity('${item.id}', this.value); loadCartItems();">
        <span>PKR ${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    `;
    cartItemsList.appendChild(li);
  });
  
  updateCheckoutTotals();
}

// Calculate and update totals
function updateCheckoutTotals() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 200 : 0;
  const tax = subtotal * 0.02; // 2% tax
  const total = subtotal + shipping + tax;
  
  // Update display
  const subtotalEl = document.getElementById('subtotal');
  const shippingEl = document.getElementById('shipping');
  const taxEl = document.getElementById('tax');
  const totalEl = document.getElementById('total');
  
  if (subtotalEl) subtotalEl.textContent = `PKR ${subtotal.toFixed(2)}`;
  if (shippingEl) shippingEl.textContent = `PKR ${shipping.toFixed(2)}`;
  if (taxEl) taxEl.textContent = `PKR ${tax.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `PKR ${total.toFixed(2)}`;
}

// Apply coupon code (basic example)
function applyCoupon() {
  const couponInput = document.getElementById('coupon-code');
  const couponMessage = document.getElementById('coupon-message');
  
  if (!couponInput || !couponMessage) return;
  
  const code = couponInput.value.trim().toUpperCase();
  
  // Example coupon codes
  const coupons = {
    'SAVE10': 0.10,
    'SAVE20': 0.20,
    'FREESHIP': 'freeship'
  };
  
  if (coupons[code]) {
    if (code === 'FREESHIP') {
      couponMessage.textContent = '✓ Free shipping applied!';
      couponMessage.className = 'text-success mt-2';
      // You can modify shipping calculation here
    } else {
      couponMessage.textContent = `✓ ${coupons[code] * 100}% discount applied!`;
      couponMessage.className = 'text-success mt-2';
      // You can modify subtotal calculation here
    }
  } else {
    couponMessage.textContent = '✗ Invalid coupon code';
    couponMessage.className = 'text-danger mt-2';
  }
}

// Clear cart
function clearCartItems() {
  if (confirm('Are you sure you want to clear your cart?')) {
    clearCart();
    loadCartItems();
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  loadCartItems();
});