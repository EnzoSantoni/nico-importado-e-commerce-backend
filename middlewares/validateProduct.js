const productValidation = require('../validation/product.validation');

function validateProduct(req, res, next) {

    console.log(req.body)

    const validation = productValidation.validate(req.body);

    if(validation.error) {
        return res.status(400).send({
            ok: false,
            message: validation.error.details[0].message,
        })
    }

    next()


}

module.exports = { validateProduct }