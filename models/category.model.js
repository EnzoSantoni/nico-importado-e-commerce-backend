const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: String,
        unique: true,
        require: true,
        index: true,
        trim: true,
        minlength: 2,
        maxlength: 80
    },
    viewValue: {
        type: String,
        require: true,
        unique: true,
        trim: true,
        minlength: 2,
        maxlength: 80
    },
    description: {
        type: String,
        minlength: 10,
        maxlength: 300
    },
    subCategory: {
        type: Schema.Types.ObjectId,
        ref: "Subcategory",
        minlength: 2,
        maxlength: 80
    },
    
})



module.exports = mongoose.model("Category", categorySchema);