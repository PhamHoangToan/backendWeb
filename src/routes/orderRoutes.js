const express=require("express");
const authenticateToken = require("../middlewares/authenticateToken") ;
const {getOrders, getOrderById, createOrder, updateOrder, deleteOrder,getOrdersByUser,createFullOrder}=require("../controllers/orderController")
const router =express.Router();
router.get("/", getOrders);
router.get("/:id", getOrderById);
router.post("/", authenticateToken, createOrder);
router.get("/orders/my-orders", authenticateToken, getOrdersByUser);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);
router.post('/orders/full', authenticateToken, createFullOrder);
module.exports = router;
