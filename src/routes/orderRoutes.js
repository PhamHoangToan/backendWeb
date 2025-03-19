const express=require("express");
const authenticateToken = require("../middlewares/authenticateToken") ;
const {getOrders, getOrderById, createOrder, updateOrder, deleteOrder}=require("../controllers/orderController")
const router =express.Router();
router.get("/", getOrders);
router.get("/:id", getOrderById);
router.post("/", authenticateToken, createOrder);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

module.exports = router;
