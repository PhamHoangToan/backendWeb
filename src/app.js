const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Import routes
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const auth = require("./routes/auth");
const orderRoutes = require("./routes/orderRoutes");
const orderItemRoutes = require('./routes/OrderItemRoutes');
// Use routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/auth", auth);
app.use("/api/order", orderRoutes);
app.use('/api', orderItemRoutes);

module.exports = app;
