const mongoose = require('mongoose');
const Schema = mongoose.Schema

const productSchema = new Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: 100,
        required: true,
        index: true,
        trim: true
    },
    price: {
        type: Number,
        minlength: 0,
        maxlength: 10000,
        require: true
    },
    description: {
        type: String,
        minlength: 0,
        maxlength: 400,
        require: true,
        trim: true
    },
    image: {
        type: String,
        require: true
    },
    createdAt: {
        type: Number,
        default: Date.now
    },
    stock: {},
    active: {
        type: Boolean,
        default: true,
    },
    updatedAt: {
        type: Number,
        default: Date.now
    },
    category: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
        ref: "Category"
    }
})


module.exports = mongoose.model("Product", productSchema)