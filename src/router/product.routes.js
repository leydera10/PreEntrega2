import { Router } from "express";
import ProductManager from "../controllers/ProductManager.js";

const ProductRouter = Router()
const product = new ProductManager();

 ProductRouter.get("/", async (req, res) => {
    res.send(await product.getProducts())
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

 ProductRouter.put("/:id", async (req, res) => {
    let id = req.params.id
    let updateProducts = req.body;
    res.send(await product.updateProducts(id, updateProducts))
})

 ProductRouter.delete("/:id", async (req, res) => {
    let id = req.params.id
    res.send(await product.deleteProducts(id))
})

export default ProductRouter