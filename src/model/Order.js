const db = require("../config/db");
const Order={
    getAll: async () => {
        const [rows] = await db.query("SELECT * FROM orders");
        return rows;
    },

    getById: async (order_id) => {
        const [rows] = await db.query("SELECT * FROM orders WHERE order_id = ?", [order_id]);
        return rows[0];
    },

     create: async (connection, orderData) => {
        try {
          const {
            user_id,
            date,
            number,
            total_price,
            status,
            payment
          } = orderData;
      
          // Chuyển date thành kiểu MySQL DATETIME (nếu cần)
          const orderDate = date
            ? new Date(date).toISOString().slice(0, 19).replace('T', ' ')
            : new Date().toISOString().slice(0, 19).replace('T', ' ');
      
          const [result] = await connection.query(
            `INSERT INTO orders (user_id, date, number, total_price, status, payment) VALUES (?, ?, ?, ?, ?, ?)`,
            [user_id, orderDate, number, total_price, status, payment]
          );
      
          return result.insertId;
      
        } catch (error) {
          console.error('Lỗi create order:', error);
          throw error;
        }
      },
      
     
      



    findByUserId: async (user_id) => {
        console.log("Đang tìm order với user_id:", user_id);
        const [rows] = await db.query("SELECT * FROM orders WHERE user_id = ?", [user_id]);
        console.log("Kết quả rows:", rows);
        return rows;
      },
      
    update: async (order_id, user_id, date, number, total_price, status, payment) => {
        const [result] = await db.query(
            "UPDATE orders SET user_id = ?, date = ?, number = ?, total_price = ?, status = ?, payment = ? WHERE order_id = ?",
            [user_id, date, number, total_price, status, payment, order_id]
        );
        return result.affectedRows;
    },

    delete: async (order_id) => {
        const [result] = await db.query("DELETE FROM orders WHERE order_id = ?", [order_id]);
        return result.affectedRows;
    },
};

module.exports = Order;