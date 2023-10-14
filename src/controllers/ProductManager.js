import {promises as fs} from 'fs';
import { nanoid } from 'nanoid';
import { productsModel } from '../models/products.model.js';

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

    async getProductsByLimit(limit)
    {
        try {
            const products = await ProductManager.find(limit(limit));
            if (products.length < limit ){
                limit = products.length;
            }
            return products;
        } catch (error) {
            throw error;
        }
    }

    async getProductsByPage(page, productsPerPage)
    {
        if (page <= 0) {
            page = 1 
        }

        try {
            const products = await ProductManager.find()
            .skip((page - 1 ) * productsPerPage)
            .limit(productsPerPage);
            return products;
            } catch (error) {
                throw error;
            }
    }

    async getProductsByQuery(query)
    {
        console.log(query)
        try{
            const products = await productsModel.find({
                description :  { $regex: query, $options: 'i' }
            });
            console.log(products)
            return products;

        } catch (error) {
            throw error;
        }
    }

    async getProductsBySort (sortOrder) {
        try {
            const products = await productsModel
            .find({})
            .sort({ price : sortOrder});
            return products;

        } catch (error) {
            throw error;
        }
    } 

    async getProductsMaster (page = 1, limit = 10 , category, avalability, sortOrder){
        try
        {
            let filter = {};

            const startIndex = (page -1) * limit;
            const endIndex = page * limit;

            const sortOptions =  {};

            if (sortOrder === 'asc'){
                sortOptions.price = 1 ;
            } else if  (sortOrder === 'desc') {
                sortOptions.price = -1;
            }else {
                throw new Error ('El parametro para ordenar debe ser "asc" o "desc".');
            }

            if (category != "") {
                filter.category = category;
            }

            if (avalability != "" ) {
                filter.avalability = avalability;
            }

            const query = ProductManager.find(filter)
            .skip(startIndex)
            .limit(limit)
            .sort(sortOptions);;
            
            
            const products = await query.exec();

            const totalProducts = await ProductManager.countDocuments(filter);
            const totalPages = Math.ceil(totalProducts / limit);
            const hasPrevPage = startIndex > 0;
            const hasNextPage = endIndex < totalProducts;
            const prevLink = hasPrevPage ? `/api/products?page=${page - 1}&limit=${limit}` : null;
            const nextLink = hasNextPage ? `/api/products?page=${page + 1}&limit=${limit}` : null;


            return {
                status: 'success',
                payload : products,
                totalPages: totalPages,
                prevPage: hasPrevPage ? page - 1 : null,
                nextPage: hasNextPage ? page + 1 : null,
                page: page,
                hasPrevPage: hasPrevPage,
                hasNextPage: hasNextPage,
                prevLink: prevLink,
                nextLink:nextLink, 
            };
            
        } catch (error){
            console.error( 'Error al obtener los productos:', error);

            return { status: ' error ', payload: 'Error al obtener los productos'};
        }
    }
}

export default ProductManager