const Joi = require('joi');

const productSchema = Joi.object({
    name: Joi.string()
                .min(3)
                .max(100)
                .trim()
                .required()
                .messages({
                    'string.base': 'El nombre debe ser una cadena de texto',
                    'string.empty': 'El nombre no puede estar vacio',
                    'string.min': 'La cantidad minima de caracteres es 3',
                    'string.max': 'La cantidad maxima de caracteres es {#limit}',
                    'any.required': 'El nombre es un dato requerido'
                }),
    price: Joi.number(),
    description: Joi.string(),
    category: Joi.string(),
    createdAt: Joi.number(),
    active: Joi.boolean().optional()
})

module.exports = productSchema;