const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerInfo: {
        fullname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        postal: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        }
    },
    items: [{
        productId: String,
        name: String,
        price: Number,
        quantity: Number,
        subtotal: Number
    }],
    paymentMethod: {
        type: String,
        enum: ['card', 'cod', 'wallet'],
        required: true
    },
    cardDetails: {
        cardholder: String,
        lastFourDigits: String
    },
    pricing: {
        subtotal: Number,
        shipping: Number,
        tax: Number,
        discount: {
            type: Number,
            default: 0
        },
        couponCode: String,
        total: Number
    },
    status: {
        type: String,
        enum: ['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Placed'
    },
    orderNumber: {
        type: String,
        unique: true
    }
}, {
    timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', function(next) {
    if (!this.orderNumber) {
        this.orderNumber = 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);
