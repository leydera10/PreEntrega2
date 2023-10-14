import { Router } from "express";
import mongoose from "mongoose";
import ProductManager from "../controllers/ProductManager.js";

const ProductRouter = Router()
const product = new ProductManager();

ProductRouter.put("/:id", async (req, res) => {
    let id = req.params.id
    let updateProducts = req.body;
    res.send(await product.updateProducts(id, updateProducts))
})

 ProductRouter.get("/:id", async (req, res) => {
    try{
        const prodId = req.params.id;

        const productDetails = await product.getProductsById(prodId)
        res.render("viewDetails",{ product: productDetails})
    } catch (error) {
        console.error('Error al obtener producto', error);
        res.status(500).json({error: 'Error al obtener producto'});
    }
   
});

// get opcionales //

ProductRouter.get("/limit/:limit", async (req, res)=> {
    let limit = parseInt(req.params.limit)
    if (isNaN(limit)|| limit <= 0 ){
        limit = 10;
    }
    res.send(await product.getProductsByLimit(limit))
})

ProductRouter.get("/page/:page", async (req, res)=> {
    let page = parseInt(req.params.limit)
    if (isNaN(limit)|| page <= 0 ){
        limit = 1;
    }
    const productsPerPage = 1;
    res.send(await product.getProductsByPage(page, productsPerPage))
})

ProductRouter.get("/buscar/query", async (req, res)=> {
    const query = req.query.q
    console.log(query)
    res.send(await product.getProductsByQuery(query))
})

ProductRouter.get("/ordenar/sort", async (req, res )=> {
    let sortOrder = 0 ;
    if (req.query.sort) {
        if (req.query.sort === "desc") {
            sortOrder = -1;
        }
    }
    res.send(await product.getProductsBySort(sortOrder))
})

ProductRouter.get("/", async (req, res)=> {
    let sortOrder = req.query.sortOrder;
    let category = req.query.category;
    let avalability = req.query.avalability;

    if (sortOrder === undefined) {
        sortOrder = "asc"
    }
    if(category === undefined){
        category = ""
    }
    if(avalability === undefined){
        avalability = ""
    }
    res.send(await product.getProductsMaster(null,null,category,avalability,sortOrder))

})


 ProductRouter.get("/:id", async (req, res) => {
    let id = req.params.id
    res.send(await product.getProductsById(id))
})

 ProductRouter.post("/", async (req, res) => {
    let newProduct = req.body
      if (
        !newProduct.name ||
        !newProduct.description ||
        !newProduct.code ||
        !newProduct.price ||
        !newProduct.stock ||
        !newProduct.category) {
        return res.status(400).json({ error: 'Debe proporcionar todos los campos: name, description, code, price, stock, category, thumbnail (opcional).' });
    }

    res.send(await product.addProducts(newProduct))
})



 ProductRouter.delete("/:id", async (req, res) => {
    let id = req.params.id
    res.send(await product.deleteProducts(id))
})

export default ProductRouter