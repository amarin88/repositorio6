const express = require('express');
const fs = require('fs/promises');
const productos = require('./productos.json');

const puerto = 8080
const app = express();

app.use(express.urlencoded( {extended: true}));

app.get('/products', async (req, res) => {
        try {
        const productsData = await fs.readFile('./productos.json', 'utf-8');
        const products = JSON.parse(productsData);
        const limit = parseInt(req.query.limit, 10);
        const result = limit ? products.slice(0, limit) : products;
        
        res.json(result);
        } catch (error) {
        console.error('Error al leer el archivo de productos:', error);
        res.status(500).send('Error interno del servidor');
        }
    });


    app.get('/products/:pid', async (req, res) => {
        try {
        const productsData = await fs.readFile('./productos.json', 'utf8');
        const products = JSON.parse(productsData);
        const productId = req.params.pid;
        const product = products.find((p) => p.id === productId);
        
        if (product) {
            res.json({ product });
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
        } catch (error) {
        console.error('Error al leer el archivo de productos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
        }
    });

app.listen(puerto, ()=>{
    console.log (`Servidor funcionando en http://localhost:${puerto}/products/. Presionar Ctrl + C para detener`)
})

