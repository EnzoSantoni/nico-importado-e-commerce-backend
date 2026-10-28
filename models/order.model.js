const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema ({
    products: [
        {
            product: { type: Schema.Types.ObjectId, required: true, ref: "Product"},
            price: {type: Number, required: true, min: 0, max:10000000},
            quantity: {type: Number, required: true, min: 1, default: 1},
            
        }
    ],
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User'},
    createdAt: {type: Number, default: Date.now},
    updatedAt: {type: Number, default: Date.now},
    total: {type: Number, required: true},
    status: {type: String, required: true, default: "open", enum: ["open", "inprogress", "delivered", "cancelled"]},
    active: {type: Boolean, default: true},
});

module.exports = mongoose.model('Order', orderSchema)