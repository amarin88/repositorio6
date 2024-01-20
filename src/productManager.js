const fs = require('fs/promises');

class ProductManager {
    constructor(path = './src/productos.json') {
        this.path = path;
    }

    async addProduct({ title, description, price, thumbnail, code, stock }) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log('¡Faltan propiedades del producto!');
            return null;
        }

        try {
            const products = await this.getProducts();
            const codeExists = products.some((prod) => prod.code === code);
            if (codeExists) {
                console.log('El código ya existe.');
                return null;
            }

            const newProduct = {
                id: products.length + 1,
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
            };

            products.push(newProduct);
            await this.saveToFile(products);

            console.log(`Producto agregado exitosamente con ID: ${newProduct.id}`);
            return newProduct;
        } catch (error) {
            console.error('Error al agregar el producto:', error);
            return null;
        }
    }

    async getProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error al obtener productos:', error);
            return [];
        }
    }

    async getProductById(id) {
        try {
            const products = await this.getProducts();
            const foundProduct = products.find((prod) => prod.id === id);

            if (!foundProduct) {
                console.log('Producto no encontrado.');
                return null;
            }

            return foundProduct;
        } catch (error) {
            console.error('Error al obtener el producto por ID:', error);
            return null;
        }
    }

    async updateProduct(id, { title, description, price, thumbnail, code, stock }) {
        try {
            const products = await this.getProducts();
            const existingProduct = products.find((prod) => prod.id === id);

            if (!existingProduct) {
                console.log('Producto no encontrado.');
                return;
            }

            const codeExists = products.some((prod) => prod.code === code && prod.id !== id);
            if (codeExists) {
                console.log('El código ya existe.');
                return;
            }

            existingProduct.title = title;
            existingProduct.description = description;
            existingProduct.price = price;
            existingProduct.thumbnail = thumbnail;
            existingProduct.code = code;
            existingProduct.stock = stock;

            await this.saveToFile(products);
            console.log(`Producto ${id} actualizado exitosamente.`);
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
        }
    }

    async deleteProduct(id) {
        try {
            const products = await this.getProducts();
            const index = products.findIndex((prod) => prod.id === id);

            if (index === -1) {
                console.log('Producto no encontrado.');
                return;
            }

            products.splice(index, 1);
            await this.saveToFile(products);

            console.log(`Producto ${id} eliminado exitosamente.`);
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    }

    async saveToFile(products) {
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    }
}