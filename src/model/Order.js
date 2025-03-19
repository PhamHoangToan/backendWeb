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

    create: async (user_id, date, number, total_price, status, payment) => {
        const [result] = await db.query(
            "INSERT INTO orders (user_id, date, number, total_price, status, payment) VALUES (?, ?, ?, ?, ?, ?)",
            [user_id, date, number, total_price, status, payment]
        );
        return result.insertId;
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