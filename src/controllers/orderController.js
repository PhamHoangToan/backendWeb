const Order =require("../model/Order")
const OrderItem =require("../model/OrderItem")
const db = require('../config/db');
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




  const createFullOrder = async (req, res) => {
    const connection = await db.getConnection();
  
    try {
      const user_id = req.user.user_id;
      const { date, number, total_price, status, payment, items } = req.body;
  
      if (!user_id || !total_price || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, message: "Thiếu thông tin hoặc danh sách sản phẩm rỗng!" });
      }
  
      await connection.beginTransaction();
  
      // CHỈNH LẠI: GỌI createOrder ĐÚNG THAM SỐ
      const order_id = await Order.create(connection, {
        user_id,
        date,
        number,
        total_price,
        status,
        payment
      });
  
      // GỌI createOrderItems TỪ OrderItemModel
      await OrderItem.createOrderItemsInDB(connection, order_id, items);
  
      await connection.commit();
  
      res.status(201).json({
        success: true,
        order_id,
        message: 'Tạo đơn hàng và chi tiết đơn hàng thành công!'
      });
  
    } catch (error) {
      console.error('Lỗi tạo đơn hàng:', error);
      if (connection) await connection.rollback();
  
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi tạo đơn hàng',
        error: error.message
      });
    } finally {
      if (connection) connection.release();
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
const getOrdersByUser = async (req, res) => {
    try {
      console.log("req.user:", req.user);
  
      const user_id = req.user.user_id; // lấy user_id từ token
      console.log("user_id từ token:", user_id);
  
      // Tìm đơn hàng theo user_id
      const orders = await Order.findByUserId(user_id);
      if (!orders) {
        console.log("Không tìm thấy đơn hàng cho user:", user_id);
      } else {
        console.log("Danh sách đơn hàng:", orders);
      }
      console.log("orders:", orders);
  
      if (!orders || orders.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: "Không tìm thấy đơn hàng nào" 
        });
      }
  
      // ✅ Trả đơn hàng về cho frontend
      res.json({ 
        success: true, 
        data: orders  // <-- Chú ý key "data" để frontend nhận đúng
      });
  
    } catch (error) {
      console.error("Lỗi khi lấy đơn hàng người dùng:", error);
      res.status(500).json({ 
        success: false, 
        message: "Lỗi server" 
      });
    }
  };
  
module.exports = { getOrders, getOrderById, createOrder, updateOrder, deleteOrder, getOrdersByUser,createFullOrder };