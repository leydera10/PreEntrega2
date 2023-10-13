import {promises as fs} from 'fs';
import { nanoid } from 'nanoid';
import ProductManager from './ProductManager.js';

const allProducts = new ProductManager;

class CartManager {
    constructor() {
        this.path = "./src/models/carts.json";
    }

    readCarts = async () => {
        let carts = await fs.readFile(this.path, "utf-8");
        return JSON.parse(carts);
    }

    writeCarts = async (cart) => {
        await fs.writeFile(this.path, JSON.stringify(cart));
    }

    exist = async (id) => {
        let carts = await this.readCarts();
        return carts.find(cart => cart.id === id);
    }

    addCarts = async () => {
        let oldCarts = await this.readCarts();
        let id = nanoid()
        let cartsConcat = [{ id : id, products : []}, ...oldCarts]
        await this.writeCarts(cartsConcat)
        return "Carrito agregado"
    }

    getCartsById = async (id) => {
        let cartById = await this.exist(id)
        if(!cartById) return "Carrito no encontrado"
        return cartById;
    };

    addProductToCart = async (cartId, productId) => {
        let cartById = await this.exist(cartId)
        if(!cartById) return "Carrito no encontrado";
        let productById = await allProducts.exist(productId)
        if(!productById) return "Producto no encontrado";
        
        let allCarts = await this.readCarts()
        let cartFilter = allCarts.filter(cart => cart.id != cartId)

        if(cartById.products.some((prod) => prod.id === productId)){
            let addProductInCart = cartById.products.find(prod => prod.id === productId)
            addProductInCart.quantity++;
            let cartsConcat = [cartById, ...cartFilter]
            await this.writeCarts(cartsConcat)
            return "Producto sumado al carrito";
        }

        cartById.products.push({id:productById.id, quantity: 1})
        let cartsConcat = [cartById, ...cartFilter]
        await this.writeCarts(cartsConcat)
        return "Producto agregado al carrito";
    }
}

export default CartManager



