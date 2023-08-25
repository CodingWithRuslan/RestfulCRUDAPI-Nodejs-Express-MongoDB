const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/productModel');

const app = express();
const port = 3000;

app.use(express.json());

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/blog', (req, res) => {
    res.send('Node Api2');
});

// Fetch all products
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add Product
app.post('/products', async (req, res) => {
    const { name, quantity, price, image } = req.body;

    try {
        const newProduct = new Product({
            name,
            quantity,
            price,
            image
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete Product
app.delete('/products/:id', async (req, res) => {
  try {
      const result = await Product.deleteOne({ _id: req.params.id });
      if (result.deletedCount > 0) {
          res.status(200).json({ message: 'Product removed' });
      } else {
          res.status(404).json({ message: 'Product not found' });
      }
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// Fetch specific product
app.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a product
app.put('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            product.name = req.body.name || product.name;
            product.quantity = req.body.quantity || product.quantity;
            product.price = req.body.price || product.price;
            product.image = req.body.image || product.image;
            const updatedProduct = await product.save();
            res.status(200).json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(port, () => {
    console.log(`Node Api is running on port ${port}`);
});

mongoose.set("strictQuery", false);
mongoose.connect('mongodb+srv://ruslan:KmYiQIGnuUwyF5RL@restfulcrudapi.7ofasyi.mongodb.net/RestfulCRUDAPI')
    .then(() => { console.log('Connected to MongoDB!'); })
    .catch(console.error);
