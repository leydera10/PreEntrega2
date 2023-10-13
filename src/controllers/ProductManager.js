import {promises as fs} from 'fs';
import { nanoid } from 'nanoid';

class ProductManager {
    constructor() {
        this.path = "./src/models/products.json";
    }

    readProducts = async () => {
        let products = await fs.readFile(this.path, "utf-8");
        return JSON.parse(products);
    }

    writeProducts = async (product) => {
        await fs.writeFile(this.path, JSON.stringify(product));
    }

    exist = async (id) => {
        let products = await this.readProducts();
        return products.find(prod => prod.id === id);
    }

    addProducts = async (product) => {
        let oldProducts = await this.readProducts();
        product.id = nanoid();
        let productAll = [...oldProducts, product];
        await this.writeProducts(productAll);
        return "Producto Agregado";
    };

    getProducts = async () => {
        return await this.readProducts()
    };

    getProductsById = async (id) => {
        let productById = await this.exist(id)
        if(!productById) return "Producto no encontrado"
        return productById;
    };

    updateProducts = async (id, product) => {
        let productById = await this.exist(id)
        if(!productById) return "Producto no encontrado"
        await this.deleteProducts(id)
        let oldProducts = await this.readProducts()
        let products = [{...product, id : id}, ...oldProducts]
        await this.writeProducts(products)
        return "Producto actualizado"
    }

    deleteProducts = async (id) => {
        let products = await this.readProducts();
        let existProducts = products.some(prod => prod.id === id)
        if (existProducts) {
            let filterProducts = products.filter(prod => prod.id != id)
            await this.writeProducts(filterProducts)
            return "Producto eliminado"
        }
        return "Producto a eliminar no existe"
    }
}

export default ProductManager