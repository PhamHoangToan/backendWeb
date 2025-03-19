const Product = require("../model/Product");

const getProduct = async (req, res) => {
    try {
        const products = await Product.getAll();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.getById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createProduct = async (req, res) => {
    try {
        const { product_name, image, description, price, size, cate_id } = req.body;
        const product_id = await Product.create(product_name, image, description, price, size, cate_id);
        res.status(201).json({ id: product_id, message: "Product created successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { product_name, image, description, price, size, cate_id } = req.body;
        const updateRows = await Product.update(req.params.id, product_name, image, description, price, size, cate_id);
        
        if (updateRows === 0) return res.status(404).json({ message: "Product not found" });
        
        res.json({ message: "Product updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const deleteRows = await Product.delete(req.params.id);
        
        if (deleteRows === 0) return res.status(404).json({ message: "Product not found" });

        res.json({ message: "Product deleted successfully" }); // ✅ Fix lỗi sai message
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getProduct, getProductById, createProduct, updateProduct, deleteProduct };
