const Order = require('../models/order.model');
const Product = require('../models/product.model');



async function postOrder(req, res) {
    try {

        if(req.user._id !== req.body.user) {
            return res.status(400).send({
                ok: false,
                message: "No puedes crear una orden para otro usuario"
            })
        }

        if(req.body.products?.length === 0 || !Array.isArray(req.body.products)) {
            return res.status(400).send({
                ok: false,
                message: "La orden no puede estar vacia"
            })
        }

        const priceError = await orderProductPriceVerification(req.body.products, req.body.total);

        if(priceError) {
            return res.status(400).send({
                ok: false,
                message: priceError
            })
        }

        const order = new Order(req.body);


        // Crear una funcion que lea cada producto que recibio y uno por uno internamente haga un doble ckeck con el valor del precio del producto almacenado en la base de datos

        const newOrder = await order.save();

        res.status(201).send({
            ok: true,
            message: "Orden creada correctamente",
            order: newOrder
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            message: "Error al crear la orden"
        })
    }
}

async function orderProductPriceVerification(products, total) {
    try {
        
        let totalOrder = 0

        for (let prod of products) {
            totalOrder += prod.price * prod.quantity;

            const product = await Product.findById(prod.product);
            if(!product || product.price !== prod.price) {
                return `El producto con id ${prod.product} no existe o el precio no coincide`;
            }
        }
        if(totalOrder !== total) {
            return  "El total no es correcto";
        }


    } catch (error) {
        console.log(error);
        throw new Error("Error al verificar precios de productos", {cause: error});
    }
}

async function getOrder(req, res) {

    try {

        const id = req.params.idUser;

        const filter = req.user.role === "ADMIN_ROLE" 
                                ? (id ? {user: id} : {}) 
                                : { user:req.user._id };


        const orders = await Order.find(filter)
                                    .populate("user", "fullname email")
                                    .populate("products.product");

        if(!orders.length) {
            return res.status(404).send({
                ok: true,
                message: "Ordenes no encontradas"
            })
        }

        return res.status(200).send({
            ok: true,
            message: "Ordenes obtenidas correctamente",
            orders
        })

    } catch (error) {
    console.log(error);
    return res.status(500).send({
        ok: false,
        message: "Error al obtener ordenes"
    })
    }
}


module.exports = {
    postOrder,
    getOrder,
}