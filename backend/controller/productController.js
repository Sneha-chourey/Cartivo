import Product from '../model/Product.js';
import { getCloudinary } from "../config/cloudinary.js";
import fs from "fs";
// 1. Get all products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// 2. Get a single product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// 3. Create a new product with Cloudinary image upload
const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Product image is required" });
        }

        const result = await getCloudinary().uploader.upload(req.file.path);
        const imageUrl = result.secure_url;

        // clean up temp file
        fs.unlink(req.file.path, (err) => {
            if (err) console.error("Temp file cleanup failed:", err.message);
        });

        const product = new Product({
            name,
            description,
            price,
            category,
            stock,
            imageUrl: [imageUrl],
        });

        const savedProduct = await product.save();
        res.status(201).json(savedProduct);

    } catch (error) {
        console.error("Create product error:", error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
// 4. Update an existing product
// 4. Update an existing product
const updateProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price !== undefined ? price : product.price;
            product.category = category || product.category;
            product.stock = stock || product.stock;

            if (req.file) {
                const result = await getCloudinary().uploader.upload(req.file.path);
                product.imageUrl = result.secure_url;

                fs.unlink(req.file.path, (err) => {
                    if (err) console.error("Temp file cleanup failed:", err.message);
                });
            }

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
// 5. Delete a product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await Product.deleteOne({ _id: req.params.id });
        res.json({ message: 'Product removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// 6. Get top rated products (sorted by highest rating)
const getTopProducts = async (req, res) => {
    try {
        // Fetches top 3 products sorted by rating in descending order (-1)
        const products = await Product.find({}).sort({ rating: -1 }).limit(3);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Export all functions
export {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getTopProducts
};