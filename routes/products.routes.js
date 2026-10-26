const express = require('express');
const router =  express.Router();
const productController = require('../controllers/products.controller')
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");
const upload = require("../middlewares/upload");


//TODO: ACTIVAR de nuevo auth, isAdmin,
//GET products
router.get("/products", productController.getProducts)
//GET products by ID
router.get("/products/:id", productController.getProductsByID)
//POST products
router.post("/products", [auth, isAdmin, upload ], productController.postProduct)
//DELETE products (ID)
router.delete("/products/:id", [auth, isAdmin], productController.deleteProduct)
//PUT products (ID)
router.put("/products/:id", [auth, isAdmin, upload], productController.updateProduct)



module.exports = router;