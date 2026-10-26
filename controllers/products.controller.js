const Product = require("../models/product.model")



async function getProducts(req, res) {
    const page = +req.query.page || 0;
    const limitProduct = +req.query.limit || 5;


    try {
        
        const [products, total] = await Promise.all([
            Product.find()
                    .populate("category", "name")
                    .skip(page * limitProduct)
                    .limit(limitProduct),
            
                    Product.countDocuments()
        ])
        
        res.status(200).send({
            ok: true,
            message: 'Productos obtenidos correctamente',
            products,
            total,
            limitProduct
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            message: "Error al obtener productos"
        })
    }
}
async function getProductsByID(req, res) {
    try {
        const id = req.params.id;
        
        const product = await Product.findById(id).populate("category", "name");

        if(!product) {
            return res.status(404).send({
                ok: false,
                message: "No se pudo obtener el producto"
            })
        }

        res.status(200).send({
            ok: true,
            message: "Producto obtenido correctamente",
            product
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            message: "Error al obtener producto"
        })
    }
}
async function postProduct(req, res) {
    try {
        const product = new Product(req.body);

        if(req.file?.filename) {
            product.image = req.file.filename
        }

        const newProduct = await product.save();

        res.status(201).send({
            ok: true,
            message: "Producto creado correctamente",
            product: newProduct
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            message: "Error al crear producto"
        })
    }
}
async function deleteProduct(req, res) {
    try {
        const id = req.params.id;

        const deletedProduct = await Product.findByIdAndDelete(id);

        if(!deletedProduct) {
            return res.status(404).send({
                ok: false,
                message: "No se pudo borrar el producto"
            })
        }

        res.status(200).send({
            ok: true,
            message: "Producto eliminado correctamente",
            deletedProduct
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            message: "Error al obtener producto"
        })
    }
}
async function updateProduct(req, res) {
    try {
        const id = req.params.id;
        const data = req.body;
        data.updatedAt = Date.now();

        if(req.file?.filename) {
            data.image = req.file.filename
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, data, {new: true});

        if(!updatedProduct) {
            return res.status(404).send({
                ok: false,
                message: "No se pudo actualizar el producto"
            })
        }

        res.status(200).send({
            ok: true,
            message: "Producto correctamente modificado",
            updatedProduct
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            message: "Error al obtener producto"
        })
    }
}



module.exports = {
    getProducts,
    getProductsByID,
    deleteProduct,
    postProduct,
    updateProduct
}