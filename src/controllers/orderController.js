const Order =require("../model/Order")
const getOrders = async (req, res) => {
    try {
        const orders = await Order.getAll();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.getById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createOrder = async (req, res) => {
    try {
      const user_id = req.user.user_id; // <-- user_id lấy từ token đã decode
      const { date, number, total_price, status, payment } = req.body;
  
      if (!user_id || !total_price) {
        return res.status(400).json({ success: false, message: "Thiếu thông tin đơn hàng" });
      }
  
      const order_id = await Order.create(user_id, date, number, total_price, status, payment);
  
      res.status(201).json({
        success: true,
        id: order_id,
        message: "Order created successfully"
      });
  
    } catch (error) {
      console.error("Lỗi khi tạo order:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  };
  

const updateOrder = async (req, res) => {
    try {
        const { user_id, date, number, total_price, status, payment } = req.body;
        const updateRows = await Order.update(req.params.id, user_id, date, number, total_price, status, payment);
        
        if (updateRows === 0) return res.status(404).json({ message: "Order not found" });
        
        res.json({ message: "Order updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const deleteRows = await Order.delete(req.params.id);
        
        if (deleteRows === 0) return res.status(404).json({ message: "Order not found" });
        
        res.json({ message: "Order deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
module.exports = { getOrders, getOrderById, createOrder, updateOrder, deleteOrder };